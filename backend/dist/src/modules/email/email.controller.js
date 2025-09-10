"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
let EmailController = class EmailController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendTestEmail(body) {
        try {
            console.log('[TestEmail] Sending test email to:', body.email);
            console.log('[TestEmail] Environment check:', {
                SMTP_HOST: process.env.SMTP_HOST,
                SMTP_PORT: process.env.SMTP_PORT,
                SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT SET',
                SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
                SMTP_FROM: process.env.SMTP_FROM,
            });
            await this.emailService.sendResetCode(body.email, '123456');
            return {
                success: true,
                message: 'Test email sent successfully',
            };
        }
        catch (error) {
            console.error('[TestEmail] Error:', error);
            return {
                success: false,
                error: error.message,
                details: error,
            };
        }
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('send-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendTestEmail", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('test-email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=email.controller.js.map