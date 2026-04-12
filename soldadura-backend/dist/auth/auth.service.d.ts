import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './auth.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    private mailService;
    private readonly logger;
    constructor(userRepo: Repository<User>, jwtService: JwtService, mailService: MailService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        email: string;
        devOtp: string | undefined;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../entities/user.entity").UserRole;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: import("../entities/user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
