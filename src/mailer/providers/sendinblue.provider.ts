import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiClient, TransactionalEmailsApi } from 'sib-api-v3-sdk';
import { EmailPayload } from '../interfaces/email.provider.interface';

@Injectable()
export class SendinBlueProvider {
  private transporter;

  constructor(apiKey: string) {
    ApiClient.instance.authentications['api-key'].apiKey = apiKey;
    this.transporter = new TransactionalEmailsApi();
  }

  async sendEmail({ from, html, subject, to }: EmailPayload) {
    await this.transporter
      .sendTransacEmail({
        subject: subject,
        sender: {
          email: from,
          name: `catt charm testing 3`,
        },
        // replyTo: { email: "api@sendinblue.com", name: "Sendinblue" },
        to: [{ name: 'John Doe', email: to }],
        htmlContent: html,
      })
      .then(() => {
        return {
          error: false,
          message: 'Email sent successfully',
        };
      })
      .catch((error: any) => {
        throw new BadRequestException(error);
      });
  }
}
