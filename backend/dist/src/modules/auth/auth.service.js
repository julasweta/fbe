"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_resp_mapper_1 = require("../users/dto/user-resp-mapper");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new common_1.NotFoundException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return user;
    }
    async login(user) {
        if (!user || !user.id || !user.email) {
            throw new common_1.UnauthorizedException('Недостатньо даних користувача');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        try {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { refreshToken },
            });
        }
        catch (error) {
            console.error('[AuthService] Failed to update user tokens:', error);
            throw new common_1.UnauthorizedException('Помилка при оновленні токенів');
        }
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message || 'Invalid refresh token');
        }
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing)
            throw new common_1.UnauthorizedException('Email already exists');
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
        return user_resp_mapper_1.UserResponseMapper.toResUserMapper(currentUser);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid)
            throw new common_1.BadRequestException('Поточний пароль неправильний');
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword)
            throw new common_1.BadRequestException('Новий пароль не може співпадати з поточним');
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword, refreshToken: null },
        });
    }
    async forgotPassword(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Користувач не знайдений');
            }
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const resetCodeExpiry = new Date();
            resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetCode,
                    resetCodeExpiry,
                },
            });
            try {
                await this.emailService.sendResetCode(email, resetCode);
            }
            catch (emailError) {
                console.error('[AuthService] Failed to send reset code email:', emailError.message);
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        resetCode: null,
                        resetCodeExpiry: null,
                    },
                });
                throw new Error('Не вдалося відправити код на email. Спробуйте пізніше.');
            }
        }
        catch (error) {
            console.error('[AuthService] Forgot password error:', error);
            if (error.message.includes('email')) {
                throw error;
            }
            throw new Error('Помилка при обробці запиту відновлення пароля');
        }
    }
    async resetPassword(email, resetCode, newPassword) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Невалідний код або час дії коду закінчився');
            }
            if (!user.resetCode || user.resetCode !== resetCode) {
                throw new common_1.UnauthorizedException('Невалідний код або час дії коду закінчився');
            }
            if (!user.resetCodeExpiry || new Date() > user.resetCodeExpiry) {
                throw new common_1.UnauthorizedException('Невалідний код або час дії коду закінчився');
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedNewPassword,
                    resetCode: null,
                    resetCodeExpiry: null,
                    refreshToken: null,
                },
            });
            console.log(`[AuthService] Password reset successfully for user: ${user.id}`);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('[AuthService] Reset password error:', error);
            throw new common_1.UnauthorizedException('Невалідний код або час дії коду закінчився');
        }
    }
    logout(userId) {
        console.log(`Logging out user with ID: ${userId}`);
        return { message: 'User logged out' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map