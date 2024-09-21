import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail, { Address } from 'nodemailer/lib/mailer';
import { SendEmailDto } from 'src/modules/share/email/mail.interface';

@Injectable()
export class EmailService {
  logger = new Logger(EmailService.name);
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mailHost'),
      port: this.configService.get<number>('mailPort'),
      secure: false,
      auth: {
        user: this.configService.get<string>('mailUser'),
        pass: this.configService.get<string>('mailPassword'),
      },
    });

    return transporter;
  }

  async sendEmail(data: SendEmailDto) {
    const { from, recipients, subject, html } = data;

    const transporter = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('appName'),
        address: this.configService.get<string>('defaultMailFrom'),
      },
      to: recipients,
      subject,
      html,
    };
    try {
      const result = await transporter.sendMail(options);
      return result;
    } catch (error) {}
  }

  async sendVerificationEmail(to: Address, token: string) {
    const verifyUrl = `${this.configService.get<string>(
      'frontUrl',
    )}/verify-email?token=${token}`;
    const html = `<h1>Email Verification</h1>
                  <p>Please verify your email by clicking the link below:</p>
                  <a href="${verifyUrl}">Verify Email</a>`;
    const emailDtoObject: SendEmailDto = {
      html,
      recipients: [to],
      subject: 'Email Verification',
    };
    return this.sendEmail(emailDtoObject);
  }

  async sendResetPasswordEmail(to: Address, token: string) {
    const resetUrl = `${this.configService.get<string>(
      'frontUrl',
    )}/reset-password?token=${token}`;
    const html = `<h1>Reset Password</h1>
                  <p>Click the link below to reset your password:</p>
                  <a href="${resetUrl}">Reset Password</a>`;

    const emailDtoObject: SendEmailDto = {
      html,
      recipients: [to],
      subject: 'Reset Password',
    };
    return this.sendEmail(emailDtoObject);
  }

  async sendChangePasswordEmail(to: Address) {
    const html = `<h1>Password Changed Successfully</h1>
                  <p>Your password has been changed successfully. If you didn't perform this action, please contact support immediately.</p>`;

    const emailDtoObject: SendEmailDto = {
      html,
      recipients: [to],
      subject: 'Password Changed Successfully',
    };

    return this.sendEmail(emailDtoObject);
  }
}
