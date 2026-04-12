import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class SeedService {
    private userRepo;
    private readonly logger;
    constructor(userRepo: Repository<User>);
    seedAdmin(): Promise<void>;
}
