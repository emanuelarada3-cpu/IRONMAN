import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { UpdateSettingsDto } from './settings.dto';
export declare class SettingsService {
    private settingRepo;
    constructor(settingRepo: Repository<Setting>);
    seedDefaults(): Promise<void>;
    getPublic(): Promise<Record<string, string>>;
    getAll(): Promise<Setting[]>;
    updateMany(dto: UpdateSettingsDto): Promise<Setting[]>;
}
