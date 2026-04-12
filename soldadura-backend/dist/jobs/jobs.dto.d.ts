import { JobStatus } from '../entities/job.entity';
export declare class CreateJobDto {
    description: string;
    latitude?: number;
    longitude?: number;
    address?: string;
}
export declare class UpdateJobStatusDto {
    status: JobStatus;
    notes?: string;
}
