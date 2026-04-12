import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class UpdateSettingsDto {
  settings: UpdateSettingDto[];
}
