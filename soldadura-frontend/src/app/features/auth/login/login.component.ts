import { Component, signal, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: ` <div class="auth-page login-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🔥 Iniciar sesión</h1>
          <p>Accede a solicitar trabajos de soldadura</p>
        </div>

        @if (devOtp()) {
          <div class="alert alert-dev">
            🛠️ Modo desarrollo &mdash; Código OTP: <strong>{{ devOtp() }}</strong>
          </div>
        }

        @if (!otpSent()) {
          <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="auth-form">
            <div class="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="tu@email.com"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <span class="error">Correo inválido</span>
              }
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                formControlName="password"
                class="form-control"
                placeholder="••••••••"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <span class="error">Mínimo 6 caracteres</span>
              }
            </div>
            @if (error()) {
              <div class="alert alert-danger">{{ error() }}</div>
            }
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="isLoading() || loginForm.invalid"
            >
              @if (isLoading()) {
                ⏳ Enviando...
              } @else {
                Continuar
              }
            </button>
          </form>
        } @else {
          <form [formGroup]="otpForm" (ngSubmit)="submitOtp()" class="auth-form">
            <div class="otp-header">
              <p>Se envió un código de 6 dígitos a:</p>
              <p class="email-display">{{ pendingEmail() }}</p>
              <button type="button" class="btn-link" (click)="backToLogin()">Otro correo</button>
            </div>
            <div class="form-group">
              <label>Código OTP</label>
              <input
                type="text"
                formControlName="otp"
                class="form-control otp-input"
                placeholder="000000"
                maxlength="6"
                inputmode="numeric"
              />
              @if (otpForm.get('otp')?.invalid && otpForm.get('otp')?.touched) {
                <span class="error">Código debe tener 6 dígitos</span>
              }
            </div>
            @if (error()) {
              <div class="alert alert-danger">{{ error() }}</div>
            }
            <p class="otp-note">⏱️ El código expira en 10 minutos</p>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="isLoading() || otpForm.invalid"
            >
              @if (isLoading()) {
                ⏳ Verificando...
              } @else {
                Verificar código
              }
            </button>
          </form>
        }

        <div class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/register">Registrarse aquí</a>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    afterNextRender(() => {
      // Forms initialized
    });
  }

  loginForm: FormGroup = undefined!;
  otpForm: FormGroup = undefined!;

  isLoading = signal(false);
  error = signal('');
  otpSent = signal(false);
  pendingEmail = signal('');
  devOtp = signal('');

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  submitLogin() {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.error.set('');
    const { email, password } = this.loginForm.value;
    this.auth.login(email || '', password || '').subscribe({
      next: (res) => {
        this.pendingEmail.set(res.email);
        this.otpSent.set(true);
        this.isLoading.set(false);
        if (res.devOtp) {
          this.devOtp.set(res.devOtp);
          // Auto-rellenar el OTP en modo desarrollo
          this.otpForm.patchValue({ otp: res.devOtp });
        }
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Error inmediato de login');
        this.isLoading.set(false);
      },
    });
  }

  submitOtp() {
    if (this.otpForm.invalid) return;
    this.isLoading.set(true);
    this.error.set('');
    const otp = this.otpForm.value.otp || '';
    this.auth.verifyOtp(otp).subscribe({
      next: () => {
        this.router.navigate([this.auth.getRedirectPath(this.auth.userRole()!)]);
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Código OTP inválido');
        this.isLoading.set(false);
      },
    });
  }

  backToLogin() {
    this.otpSent.set(false);
    this.otpForm.reset();
    this.error.set('');
  }
}
