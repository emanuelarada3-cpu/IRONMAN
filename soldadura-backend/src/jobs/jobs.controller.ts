import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobStatusDto } from './jobs.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  create(@Request() req, @Body() dto: CreateJobDto) {
    return this.jobsService.create(req.user.id, dto);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('mine')
  @Roles(UserRole.USER, UserRole.ADMIN)
  findMine(@Request() req) {
    return this.jobsService.findMine(req.user.id);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobStatusDto,
    @Request() req,
  ) {
    return this.jobsService.updateStatus(id, dto, req.user);
  }
}
