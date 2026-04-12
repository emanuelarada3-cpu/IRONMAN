export type UserRole = 'admin' | 'owner' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: { id: number; name: string; email: string; role: UserRole };
}

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: number;
  userId: number;
  user?: User;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status: JobStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  label?: string;
}

export interface BusinessSettings {
  business_name?: string;
  business_slogan?: string;
  business_address?: string;
  business_lat?: string;
  business_lng?: string;
  whatsapp?: string;
  business_phone_display?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  years_experience?: string;
  jobs_done?: string;
  clients?: string;
  [key: string]: string | undefined;
}
