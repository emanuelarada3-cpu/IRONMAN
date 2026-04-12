export declare class MailService {
    private readonly logger;
    private transporter;
    private readonly isDevMode;
    constructor();
    sendOtp(email: string, otp: string, name: string): Promise<string | null>;
}
