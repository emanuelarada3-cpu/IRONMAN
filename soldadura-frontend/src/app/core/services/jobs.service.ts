import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobStatus } from '../models/models';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class JobsService {
  constructor(private http: HttpClient) {}

  create(data: {
    description: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  }): Observable<Job> {
    return this.http.post<Job>(`${API}/jobs`, data);
  }

  getAll(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API}/jobs`);
  }

  getMine(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API}/jobs/mine`);
  }

  updateStatus(id: number, status: JobStatus, notes?: string): Observable<Job> {
    return this.http.patch<Job>(`${API}/jobs/${id}/status`, { status, notes });
  }
}
