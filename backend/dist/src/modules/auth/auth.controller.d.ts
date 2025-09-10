import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create.users.dto';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(body: CreateUserDto): Promise<Partial<import("../users/dto/base-user.dto").BaseUserDto>>;
    logout(req: Request): {
        message: string;
    };
    refresh(body: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(body: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
    forgotPassword(body: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
