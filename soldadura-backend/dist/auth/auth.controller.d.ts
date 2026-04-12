import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
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
