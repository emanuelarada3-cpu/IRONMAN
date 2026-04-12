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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("../entities/setting.entity");
const DEFAULT_SETTINGS = [
    { key: 'business_name', value: 'IronMan', label: 'Nombre del negocio' },
    {
        key: 'business_slogan',
        value: 'Calidad, precisión y buen precio en cada trabajo',
        label: 'Slogan',
    },
    { key: 'business_address', value: 'Las Tunas, Cuba', label: 'Dirección' },
    {
        key: 'business_lat',
        value: '20.9666',
        label: 'Latitud (ubicación en mapa)',
    },
    {
        key: 'business_lng',
        value: '-76.9511',
        label: 'Longitud (ubicación en mapa)',
    },
    {
        key: 'whatsapp',
        value: '',
        label: 'Número WhatsApp (con código de país, ej: 5353123456)',
    },
    {
        key: 'business_phone_display',
        value: '',
        label: 'Teléfono visible en la web',
    },
    { key: 'facebook', value: '', label: 'URL Facebook' },
    { key: 'instagram', value: '', label: 'URL Instagram' },
    { key: 'tiktok', value: '', label: 'URL TikTok' },
    { key: 'youtube', value: '', label: 'URL YouTube' },
    { key: 'years_experience', value: '10', label: 'Años de experiencia' },
    { key: 'jobs_done', value: '500+', label: 'Trabajos realizados' },
    { key: 'clients', value: '300+', label: 'Clientes satisfechos' },
];
let SettingsService = class SettingsService {
    settingRepo;
    constructor(settingRepo) {
        this.settingRepo = settingRepo;
    }
    async seedDefaults() {
        for (const s of DEFAULT_SETTINGS) {
            const exists = await this.settingRepo.findOne({ where: { key: s.key } });
            if (!exists) {
                await this.settingRepo.save(this.settingRepo.create(s));
            }
            else {
                await this.settingRepo.update({ key: s.key }, { value: s.value });
            }
        }
    }
    async getPublic() {
        const settings = await this.settingRepo.find();
        return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    }
    async getAll() {
        return this.settingRepo.find({ order: { key: 'ASC' } });
    }
    async updateMany(dto) {
        for (const item of dto.settings) {
            await this.settingRepo.update({ key: item.key }, { value: item.value });
        }
        return this.getAll();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map