import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({ ...dto, password: hashed });
    await this.userRepo.save(user);
    return { message: 'Usuario registrado correctamente' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !user.isActive)
      throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry.toISOString();
    await this.userRepo.save(user);

    let devOtp: string | null = null;
    try {
      devOtp = await this.mailService.sendOtp(user.email, otp, user.name);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send OTP email: ${err.message}`);
      throw new InternalServerErrorException(
        'Error al enviar el código OTP. Verifica que las credenciales SMTP estén configuradas en .env (MAIL_USER y MAIL_PASS)',
      );
    }

    return {
      message: devOtp
        ? 'Modo desarrollo: código OTP generado (ver terminal del backend)'
        : 'Código OTP enviado a tu correo',
      email: user.email,
      devOtp: devOtp ?? undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (!user.otp || user.otp !== dto.otp)
      throw new BadRequestException('Código OTP inválido');

    const expiry = user.otpExpiry ? new Date(user.otpExpiry) : null;
    if (!expiry || new Date() > expiry)
      throw new BadRequestException('El código OTP ha expirado');

    user.otp = null;
    user.otpExpiry = null;
    await this.userRepo.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { password, otp, otpExpiry, ...profile } = user;
    return profile;
  }
}
