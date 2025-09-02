import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly mailerService: MailerService) {}

  async sendResetCode(email: string, resetCode: string): Promise<void> {
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
}
