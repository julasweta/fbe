import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create.users.dto';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      if (!user) {
        throw new UnauthorizedException('Неправильний email або пароль');
      }
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[AuthController] Login error:', error);
      throw new UnauthorizedException('Помилка входу. Спробуйте пізніше');
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const res = this.authService.logout(req.user.id);
    if (!res) {
      throw new UnauthorizedException('User not logged in');
    }
    return { message: 'Logged out' };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    const tokens = await this.authService.refresh(body.refresh);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return tokens;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    await this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
    return { message: 'Пароль успішно змінено' };
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset code sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      await this.authService.forgotPassword(body.email);
      return { message: 'Код для відновлення пароля відправлено на ваш email' };
    } catch (error) {
      console.error('[AuthController] Forgot password error:', error);
      throw error; // важливо: прокидаємо далі, щоб NestJS сформував помилку
    }
  }

  @ApiOperation({ summary: 'Reset password with code' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 401, description: 'Invalid reset code or expired' })
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    console.log('body - ', body);
    try {
      await this.authService.resetPassword(
        body.email,
        body.resetCode,
        body.newPassword,
      );
      return { message: 'Пароль успішно змінено' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[AuthController] Reset password error:', error);
      throw new UnauthorizedException(
        'Невалідний код або час дії коду закінчився',
      );
    }
  }
}
