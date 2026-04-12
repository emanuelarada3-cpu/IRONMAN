import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getPublic(): Promise<Record<string, string>>;
    getAll(): Promise<import("../entities/setting.entity").Setting[]>;
    updateMany(dto: UpdateSettingsDto): Promise<import("../entities/setting.entity").Setting[]>;
}
