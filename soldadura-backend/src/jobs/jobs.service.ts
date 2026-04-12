import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { CreateJobDto, UpdateJobStatusDto } from './jobs.dto';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private jobRepo: Repository<Job>) {}

  async create(userId: number, dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepo.create({ ...dto, userId });
    return this.jobRepo.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMine(userId: number): Promise<Job[]> {
    return this.jobRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: number,
    dto: UpdateJobStatusDto,
    requestingUser: any,
  ): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Trabajo no encontrado');

    if (
      requestingUser.role === UserRole.USER &&
      job.userId !== requestingUser.id
    ) {
      throw new ForbiddenException();
    }

    job.status = dto.status;
    if (dto.notes !== undefined) job.notes = dto.notes;
    return this.jobRepo.save(job);
  }
}
