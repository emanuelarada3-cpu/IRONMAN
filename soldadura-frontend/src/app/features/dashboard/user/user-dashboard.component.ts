import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { JobsService } from '../../../core/services/jobs.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobStatus } from '../../../core/models/models';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: ` <div class="dashboard user-dashboard">
    <nav class="dashboard-nav">
      <div class="nav-brand">🔥 Mi Panel</div>
      <button class="btn btn-outline btn-sm" (click)="logout()">Cerrar sesión</button>
    </nav>

    <div class="container dashboard-content">
      <h1>Bienvenido, {{ auth.user()?.name }}!</h1>
      <p class="subtitle">Solicita trabajos de soldadura y sigue el estado de tus pedidos</p>

      <div class="dashboard-grid">
        <div class="card new-job-card">
          <h2>📋 Solicitar nuevo trabajo</h2>
          <form [formGroup]="jobForm" (ngSubmit)="submitJob()" class="job-form">
            <div class="form-group">
              <label>Descripción del trabajo</label>
              <textarea
                formControlName="description"
                class="form-control"
                rows="4"
                placeholder="Cuéntanos qué necesitas..."
              ></textarea>
            </div>
            <div class="form-group">
              <label>Ubicación (opcional)</label>
              <p class="helper-text">📍 Usaremos ésta para mostrar tu ubicación aproximada</p>
              <button type="button" class="btn btn-outline btn-sm" (click)="getLocation()">
                Obtener ubicación actual
              </button>
              @if (locationDisplay()) {
                <p class="location-display">{{ locationDisplay() }}</p>
              }
            </div>
            @if (error()) {
              <div class="alert alert-danger">{{ error() }}</div>
            }
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="isLoading() || jobForm.invalid"
            >
              Solicitar
            </button>
          </form>
        </div>

        <div class="card jobs-card">
          <h2>📦 Mis solicitudes</h2>
          @if (jobs().length > 0) {
            <div class="jobs-list">
              @for (job of jobs(); track job.id) {
                <div class="job-item" [class]="'status-' + job.status">
                  <div class="job-header">
                    <span class="job-id">Job #{{ job.id }}</span>
                    <span [class]="'badge badge-' + job.status">{{
                      formatStatus(job.status)
                    }}</span>
                  </div>
                  <p class="job-description">{{ job.description.substring(0, 80) }}...</p>
                  <p class="job-date">{{ job.createdAt | date: 'short' }}</p>
                  @if (job.notes) {
                    <p class="job-notes"><strong>Notas:</strong> {{ job.notes }}</p>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="empty">Aún no has solicitado ningún trabajo</p>
          }
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobsService = inject(JobsService);
  auth = inject(AuthService);
  private router = inject(AuthService); // para logout

  jobForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    address: [''],
  });

  jobs = signal<Job[]>([]);
  isLoading = signal(false);
  error = signal('');
  locationDisplay = signal('');
  private coordinates = { lat: 0, lng: 0 };

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobsService.getMine().subscribe({
      next: (j) => this.jobs.set(j),
      error: () => this.jobs.set([]),
    });
  }

  submitJob() {
    if (this.jobForm.invalid) return;
    this.isLoading.set(true);
    this.error.set('');
    const { description, address } = this.jobForm.value;
    this.jobsService
      .create({
        description: description || '',
        latitude: this.coordinates.lat || undefined,
        longitude: this.coordinates.lng || undefined,
        address: address || undefined,
      })
      .subscribe({
        next: () => {
          this.jobForm.reset();
          this.locationDisplay.set('');
          this.loadJobs();
          this.isLoading.set(false);
        },
        error: (err: any) => {
          this.error.set(err.error?.message || 'Error al crear solicitud');
          this.isLoading.set(false);
        },
      });
  }

  getLocation() {
    if (!navigator.geolocation) {
      this.error.set('Geolocalización no disponible en tu navegador');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.coordinates = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.locationDisplay.set(
          `📍 ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        );
      },
      () => this.error.set('No pudimos acceder a tu ubicación'),
    );
  }

  formatStatus(status: JobStatus): string {
    const map: Record<JobStatus, string> = {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return map[status] || status;
  }

  logout() {
    this.auth.logout();
  }
}
