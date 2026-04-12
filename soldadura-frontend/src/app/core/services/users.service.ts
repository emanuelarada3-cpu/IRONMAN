import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/users`);
  }

  updateRole(id: number, role: string): Observable<User> {
    return this.http.patch<User>(`${API}/users/${id}/role`, { role });
  }

  toggleActive(id: number): Observable<{ id: number; isActive: boolean }> {
    return this.http.patch<{ id: number; isActive: boolean }>(
      `${API}/users/${id}/toggle-active`,
      {},
    );
  }
}
