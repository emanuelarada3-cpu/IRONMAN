"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    isDevMode;
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
    async sendOtp(email, otp, name) {
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
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to send OTP to ${email}: ${err.message}`);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map