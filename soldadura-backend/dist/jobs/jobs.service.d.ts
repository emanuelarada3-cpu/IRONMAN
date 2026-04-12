import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { CreateJobDto, UpdateJobStatusDto } from './jobs.dto';
export declare class JobsService {
    private jobRepo;
    constructor(jobRepo: Repository<Job>);
    create(userId: number, dto: CreateJobDto): Promise<Job>;
    findAll(): Promise<Job[]>;
    findMine(userId: number): Promise<Job[]>;
    updateStatus(id: number, dto: UpdateJobStatusDto, requestingUser: any): Promise<Job>;
}
