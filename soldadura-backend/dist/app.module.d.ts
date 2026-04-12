import { OnModuleInit } from '@nestjs/common';
import { SettingsService } from './settings/settings.service';
import { SeedService } from './seed.service';
export declare class AppModule implements OnModuleInit {
    private settingsService;
    private seedService;
    constructor(settingsService: SettingsService, seedService: SeedService);
    onModuleInit(): Promise<void>;
}
