import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobStatusDto } from './jobs.dto';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    create(req: any, dto: CreateJobDto): Promise<import("../entities/job.entity").Job>;
    findAll(): Promise<import("../entities/job.entity").Job[]>;
    findMine(req: any): Promise<import("../entities/job.entity").Job[]>;
    updateStatus(id: number, dto: UpdateJobStatusDto, req: any): Promise<import("../entities/job.entity").Job>;
}
