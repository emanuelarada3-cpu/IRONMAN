import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, User, UserRole } from '../models/models';

import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _pendingEmail = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly pendingEmail = this._pendingEmail.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly userRole = computed(() => this._user()?.role ?? null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const saved = localStorage.getItem('soldadura_token');
    const savedUser = localStorage.getItem('soldadura_user');
    if (saved && savedUser) {
      this._token.set(saved);
      this._user.set(JSON.parse(savedUser));
    }
  }

  register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.http.post(`${API}/auth/register`, data);
  }

  login(
    email: string,
    password: string,
  ): Observable<{ message: string; email: string; devOtp?: string }> {
    return this.http
      .post<{ message: string; email: string }>(`${API}/auth/login`, { email, password })
      .pipe(tap((res) => this._pendingEmail.set(res.email)));
  }

  verifyOtp(otp: string): Observable<AuthResponse> {
    const email = this._pendingEmail();
    return this.http.post<AuthResponse>(`${API}/auth/verify-otp`, { email, otp }).pipe(
      tap((res) => {
        this._token.set(res.access_token);
        this._user.set(res.user as User);
        localStorage.setItem('soldadura_token', res.access_token);
        localStorage.setItem('soldadura_user', JSON.stringify(res.user));
        this._pendingEmail.set(null);
      }),
    );
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this._pendingEmail.set(null);
    localStorage.removeItem('soldadura_token');
    localStorage.removeItem('soldadura_user');
    this.router.navigate(['/']);
  }

  getRedirectPath(role: UserRole): string {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'owner') return '/dashboard/owner';
    return '/dashboard/user';
  }
}
