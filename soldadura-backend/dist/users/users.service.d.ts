import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateRoleDto } from './users.dto';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findAll(): Promise<User[]>;
    updateRole(id: number, dto: UpdateRoleDto): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: import("../entities/user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleActive(id: number): Promise<{
        id: number;
        isActive: boolean;
    }>;
}
