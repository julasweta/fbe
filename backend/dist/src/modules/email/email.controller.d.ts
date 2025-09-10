import { EmailService } from './email.service';
export declare class EmailController {
    private emailService;
    constructor(emailService: EmailService);
    sendTestEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: any;
        details: any;
        message?: undefined;
    }>;
}
