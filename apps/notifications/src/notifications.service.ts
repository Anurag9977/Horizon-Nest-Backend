import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly transport: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transport = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: configService.get('SMTP_USER'),
        clientId: configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  }

  async sendEmail(emailId: string, emailSubject: string, emailBody: string) {
    await this.transport.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: emailId,
      subject: emailSubject,
      text: emailBody,
    });
  }
}
