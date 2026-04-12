"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const user_entity_1 = require("./entities/user.entity");
const job_entity_1 = require("./entities/job.entity");
const setting_entity_1 = require("./entities/setting.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const jobs_module_1 = require("./jobs/jobs.module");
const settings_module_1 = require("./settings/settings.module");
const mail_module_1 = require("./mail/mail.module");
const settings_service_1 = require("./settings/settings.service");
const seed_service_1 = require("./seed.service");
const dbUrl = process.env.DATABASE_URL;
const dbConfig = dbUrl
    ? {
        type: 'postgres',
        url: dbUrl,
        entities: [user_entity_1.User, job_entity_1.Job, setting_entity_1.Setting],
        synchronize: true,
        logging: false,
        ssl: { rejectUnauthorized: false },
    }
    : {
        type: 'better-sqlite3',
        database: process.env.DB_PATH || 'soldadura.sqlite',
        entities: [user_entity_1.User, job_entity_1.Job, setting_entity_1.Setting],
        synchronize: true,
        logging: false,
    };
let AppModule = class AppModule {
    settingsService;
    seedService;
    constructor(settingsService, seedService) {
        this.settingsService = settingsService;
        this.seedService = seedService;
    }
    async onModuleInit() {
        await this.settingsService.seedDefaults();
        await this.seedService.seedAdmin();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
            typeorm_1.TypeOrmModule.forRoot(dbConfig),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            jobs_module_1.JobsModule,
            settings_module_1.SettingsModule,
            mail_module_1.MailModule,
        ],
        providers: [seed_service_1.SeedService],
    }),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        seed_service_1.SeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map