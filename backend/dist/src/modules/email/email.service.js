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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailService = class EmailService {
    mailerService;
    transporter;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendResetCode(email, resetCode) {
        const resetLink = `http://localhost:5173/reset-password?code=${resetCode}&email=${email}`;
        await this.mailerService
            .sendMail({
            to: email,
            from: '"FBE" <fbe.info.store@gmail.com>',
            subject: 'Відновлення пароля',
            text: `Для скидання пароля перейдіть за посиланням: ${resetLink}`,
            html: ` <p>Для скидання пароля натисніть на посилання:</p>
                <a href="${resetLink}">${resetLink}</a>
  `,
        })
            .then((success) => {
            console.log(success);
        })
            .catch((err) => {
            console.log(err);
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map