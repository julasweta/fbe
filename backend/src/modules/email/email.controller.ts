import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

// Тимчасовий контролер для тестування email
@Controller('test-email')
export class EmailController {
  constructor(private emailService: EmailService) { }

  @Post('send-test')
  async sendTestEmail(@Body() body: { email: string }) {
    try {
      console.log('[TestEmail] Sending test email to:', body.email);

      // Перевірка змінних середовища
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
        message: 'Test email sent successfully'
      };
    } catch (error) {
      console.error('[TestEmail] Error:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

// Додайте цей контролер до EmailModule для тестування:
// controllers: [TestEmailController]
