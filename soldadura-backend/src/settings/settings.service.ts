import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { UpdateSettingsDto } from './settings.dto';

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

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private settingRepo: Repository<Setting>,
  ) {}

  async seedDefaults(): Promise<void> {
    for (const s of DEFAULT_SETTINGS) {
      const exists = await this.settingRepo.findOne({ where: { key: s.key } });
      if (!exists) {
        await this.settingRepo.save(this.settingRepo.create(s));
      } else {
        await this.settingRepo.update({ key: s.key }, { value: s.value });
      }
    }
  }

  async getPublic(): Promise<Record<string, string>> {
    const settings = await this.settingRepo.find();
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  async getAll(): Promise<Setting[]> {
    return this.settingRepo.find({ order: { key: 'ASC' } });
  }

  async updateMany(dto: UpdateSettingsDto): Promise<Setting[]> {
    for (const item of dto.settings) {
      await this.settingRepo.update({ key: item.key }, { value: item.value });
    }
    return this.getAll();
  }
}
