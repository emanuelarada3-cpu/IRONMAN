export declare enum UserRole {
    ADMIN = "admin",
    OWNER = "owner",
    USER = "user"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    otp: string | null;
    otpExpiry: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
