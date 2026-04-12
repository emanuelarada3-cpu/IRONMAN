import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seedAdmin(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@soldadurallastunas.cu';
    const exists = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (!exists) {
      const password = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin1234!',
        12,
      );
      await this.userRepo.save(
        this.userRepo.create({
          name: 'Administrador',
          email: adminEmail,
          password,
          role: UserRole.ADMIN,
        }),
      );
      this.logger.log(`✅ Admin created: ${adminEmail}`);
    }
  }
}
