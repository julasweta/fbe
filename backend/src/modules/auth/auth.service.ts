import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create.users.dto';
import { UserResponseMapper } from '../users/dto/user-resp-mapper';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService, // Додайте EmailService для відправки кодів
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Перевірка, чи user валідний (якщо це не зроблено раніше)
    if (!user || !user.id || !user.email) {
      throw new UnauthorizedException('Недостатньо даних користувача');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Збільшено до 1 години
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Збільшено до 7 днів

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }, // Зберігаємо лише refreshToken
      });
    } catch (error) {
      console.error('[AuthService] Failed to update user tokens:', error);
      throw new UnauthorizedException('Помилка при оновленні токенів');
    }

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '10s',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '360s',
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { accessToken, refreshToken: newRefreshToken },
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid refresh token');
    }
  }

  async register(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date();
    resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15);

    const user = await this.prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        role: data.role,
        resetCode: resetCode || null,
        resetCodeExpiry: resetCodeExpiry ? new Date(resetCodeExpiry) : null,
      },
    });

    const currentUser = await this.login(user);
    return UserResponseMapper.toResUserMapper(currentUser);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Знаходимо користувача
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password) {
        throw new UnauthorizedException('Користувача не знайдено');
      }

      // Перевіряємо поточний пароль
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Поточний пароль неправильний');
      }

      // Перевіряємо, чи новий пароль не співпадає з поточним
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new UnauthorizedException(
          'Новий пароль не може співпадати з поточним',
        );
      }

      // Хешуємо новий пароль
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Оновлюємо пароль в базі даних
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          // Опціонально: інвалідуємо refresh токен для додаткової безпеки
          refreshToken: null,
        },
      });

      console.log(`[AuthService] Password changed for user: ${userId}`);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[AuthService] Change password error:', error);
      throw new UnauthorizedException('Помилка зміни пароля');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log(`[AuthService] Processing forgot password for: ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Не розкриваємо, що користувача не існує
        console.log(
          `[AuthService] Forgot password request for non-existent email: ${email}`,
        );
        return;
      }

      // Генеруємо 6-значний код
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpiry = new Date();
      resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15); // Код дійсний 15 хвилин

      console.log(
        `[AuthService] Generated reset code: ${resetCode} for user: ${user.id}`,
      );

      // Зберігаємо код в базі даних
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode,
          resetCodeExpiry,
        },
      });

      console.log(
        `[AuthService] Reset code saved to database for user: ${user.id}`,
      );

      // Відправляємо email з кодом
      try {
        console.log(`ja v servic`);
        await this.emailService.sendResetCode(email, resetCode);
        console.log(
          `[AuthService] Reset code email sent successfully to: ${email}`,
        );
      } catch (emailError) {
        console.error(
          '[AuthService] Failed to send reset code email:',
          emailError.message,
        );

        // Очищаємо код з бази, якщо email не відправився
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            resetCode: null,
            resetCodeExpiry: null,
          },
        });

        throw new Error(
          'Не вдалося відправити код на email. Спробуйте пізніше.',
        );
      }
    } catch (error) {
      console.error('[AuthService] Forgot password error:', error);
      if (error.message.includes('email')) {
        throw error; // Прокидуємо email помилки
      }
      throw new Error('Помилка при обробці запиту відновлення пароля');
    }
  }

  async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Невалідний код або час дії коду закінчився',
        );
      }

      // Перевіряємо код та його термін дії
      if (!user.resetCode || user.resetCode !== resetCode) {
        throw new UnauthorizedException(
          'Невалідний код або час дії коду закінчився',
        );
      }

      if (!user.resetCodeExpiry || new Date() > user.resetCodeExpiry) {
        throw new UnauthorizedException(
          'Невалідний код або час дії коду закінчився',
        );
      }

      // Хешуємо новий пароль
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Оновлюємо пароль та очищуємо код відновлення
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedNewPassword,
          resetCode: null,
          resetCodeExpiry: null,
          // Інвалідуємо всі refresh токени для безпеки
          refreshToken: null,
        },
      });

      console.log(
        `[AuthService] Password reset successfully for user: ${user.id}`,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[AuthService] Reset password error:', error);
      throw new UnauthorizedException(
        'Невалідний код або час дії коду закінчився',
      );
    }
  }

  logout(userId) {
    console.log(`Logging out user with ID: ${userId}`);
    return { message: 'User logged out' };
  }
}
