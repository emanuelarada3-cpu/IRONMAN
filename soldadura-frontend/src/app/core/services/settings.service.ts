import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessSettings, Setting } from '../models/models';

import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private http: HttpClient) {}

  getPublic(): Observable<BusinessSettings> {
    return this.http.get<BusinessSettings>(`${API}/settings/public`);
  }

  getAll(): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${API}/settings`);
  }

  updateMany(settings: { key: string; value: string }[]): Observable<Setting[]> {
    return this.http.put<Setting[]>(`${API}/settings`, { settings });
  }
}
