import { Component, signal, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: ` <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>📝 Crear cuenta</h1>
          <p>Únete a nuestra plataforma de solicitud de servicios</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="submit()" class="auth-form">
          <div class="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              formControlName="name"
              class="form-control"
              placeholder="Tu nombre"
            />
            @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
              <span class="error">Nombre requerido</span>
            }
          </div>

          <div class="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              formControlName="email"
              class="form-control"
              placeholder="tu@email.com"
            />
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <span class="error">Correo inválido</span>
            }
          </div>

          <div class="form-group">
            <label>Teléfono (opcional)</label>
            <input
              type="tel"
              formControlName="phone"
              class="form-control"
              placeholder="+53 5312345"
            />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              formControlName="password"
              class="form-control"
              placeholder="Mínimo 6 caracteres"
            />
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <span class="error">Mínimo 6 caracteres</span>
            }
          </div>

          <div class="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              formControlName="confirmPassword"
              class="form-control"
              placeholder="Repite la contraseña"
            />
            @if (
              registerForm.get('confirmPassword')?.invalid &&
              registerForm.get('confirmPassword')?.touched
            ) {
              <span class="error">Las contraseñas no coinciden</span>
            }
          </div>

          @if (error()) {
            <div class="alert alert-danger">{{ error() }}</div>
          }
          @if (success()) {
            <div class="alert alert-success">Cuenta creada. Redirigiendo a login...</div>
          }

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="isLoading() || registerForm.invalid"
          >
            @if (isLoading()) {
              ⏳ Creando...
            } @else {
              Crear cuenta
            }
          </button>
        </form>

        <div class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: '../login/login.component.scss',
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    afterNextRender(() => {
      // Forms initialized
    });
  }

  registerForm: FormGroup = undefined!;

  isLoading = signal(false);
  error = signal('');
  success = signal(false);

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatch },
    );
  }

  passwordMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.registerForm.invalid) return;
    this.isLoading.set(true);
    this.error.set('');
    const { name, email, password, phone } = this.registerForm.value;
    this.auth
      .register({
        name: name || '',
        email: email || '',
        password: password || '',
        phone: phone || '',
      })
      .subscribe({
        next: () => {
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err: any) => {
          this.error.set(err.error?.message || 'Error al registrar');
          this.isLoading.set(false);
        },
      });
  }
}
