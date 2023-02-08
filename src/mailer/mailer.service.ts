import { BadRequestException, Injectable } from '@nestjs/common';
import { SendinBlueProvider } from './providers/sendinblue.provider';

@Injectable()
export class MailerService {
  private readonly mailer: SendinBlueProvider;

  constructor() {
    this.mailer = new SendinBlueProvider(process.env.SENDINBLUE_API_KEY);
  }
  public async sendTestEmail() {
    try {
      await this.mailer.sendEmail({
        subject: 'test',
        from: 'cattcharm@gmail.com',
        to: 'tanvirkhaan003@gmail.com',
        html: `<!DOCTYPE html>
        <html>
          <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order is placed</title>
  </head>
  <body>
  Testing
  </body>
  </html>`,
      });

      return {
        error: false,
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async sendMail(arg0: {
    to: string;
    subject: string;
    template: string;
    context: { code: string };
  }) {
    try {
      await this.mailer.sendEmail({
        subject: arg0.subject,
        from: 'cattcharm@gmail.com',
        to: arg0.to,
        html: `<!DOCTYPE html>
        <html>
          <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OPT Code</title>
  </head>
  <body>
    <h1>OPT Code</h1>
    <p>Your OPT code is ${arg0.context.code}</p>
  </body>
  </html>`,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
