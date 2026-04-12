import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from './entities/user.entity';
import { Job } from './entities/job.entity';
import { Setting } from './entities/setting.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { SettingsModule } from './settings/settings.module';
import { MailModule } from './mail/mail.module';
import { SettingsService } from './settings/settings.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || 'soldadura.sqlite',
      entities: [User, Job, Setting],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    JobsModule,
    SettingsModule,
    MailModule,
  ],
  providers: [SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private settingsService: SettingsService,
    private seedService: SeedService,
  ) {}

  async onModuleInit() {
    await this.settingsService.seedDefaults();
    await this.seedService.seedAdmin();
  }
}
