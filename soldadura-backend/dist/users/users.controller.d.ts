import { UsersService } from './users.service';
import { UpdateRoleDto } from './users.dto';
import { UserRole } from '../entities/user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../entities/user.entity").User[]>;
    updateRole(id: number, dto: UpdateRoleDto): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleActive(id: number): Promise<{
        id: number;
        isActive: boolean;
    }>;
}
