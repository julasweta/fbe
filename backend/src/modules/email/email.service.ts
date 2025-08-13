import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly mailerService: MailerService) { }


  async sendResetCode(email: string, resetCode: string): Promise<void> {
   await this
      .mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'stugarka@gmail.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: `welcome ${resetCode}`, // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

 
}