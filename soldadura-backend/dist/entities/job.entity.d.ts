import { User } from './user.entity';
export declare enum JobStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Job {
    id: number;
    userId: number;
    user: User;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    status: JobStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
