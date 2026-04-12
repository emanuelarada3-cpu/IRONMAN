import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly isDevMode: boolean;

  constructor() {
    this.isDevMode = process.env.MAIL_DEV === 'true';
    if (!this.isDevMode) {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    }
  }

  // Devuelve el OTP si estamos en modo dev (para mostrarlo en la UI)
  async sendOtp(
    email: string,
    otp: string,
    name: string,
  ): Promise<string | null> {
    if (this.isDevMode) {
      this.logger.warn('┌─────────────────────────────────────────┐');
      this.logger.warn(`│  MODO DESARROLLO - OTP para ${email}`);
      this.logger.warn(`│  Código: ${otp}`);
      this.logger.warn('└─────────────────────────────────────────┘');
      return otp;
    }

    const businessName = process.env.BUSINESS_NAME || 'IronMan';
    try {
      if (!this.transporter) {
        throw new Error('Transporter not initialized');
      }
      await this.transporter.sendMail({
        from: `"${businessName}" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `Tu código de verificación - ${businessName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #e67e22, #d35400); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🔥 ${businessName}</h1>
              <p style="margin: 8px 0 0; opacity: 0.9;">Verificación de identidad</p>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>
              <p>Tu código de verificación es:</p>
              <div style="background: #16213e; border: 2px solid #e67e22; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #e67e22;">${otp}</span>
              </div>
              <p style="color: #aaa; font-size: 14px;">Este código expira en <strong>10 minutos</strong>.</p>
              <p style="color: #aaa; font-size: 13px;">Si no solicitaste este código, ignora este mensaje.</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`OTP sent to ${email}`);
      return null;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send OTP to ${email}: ${err.message}`);
      throw error;
    }
  }
}
