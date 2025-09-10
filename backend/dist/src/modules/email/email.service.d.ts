import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailerService;
    private transporter;
    constructor(mailerService: MailerService);
    sendResetCode(email: string, resetCode: string): Promise<void>;
}
