import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create.users.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(data: CreateUserDto): Promise<Partial<import("../users/dto/base-user.dto").BaseUserDto>>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(email: string, resetCode: string, newPassword: string): Promise<void>;
    logout(userId: any): {
        message: string;
    };
}
