import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JobsService } from '../../../core/services/jobs.service';
import { SettingsService } from '../../../core/services/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Setting, JobStatus } from '../../../core/models/models';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: ` <div class="dashboard owner-dashboard">
    <nav class="dashboard-nav">
      <div class="nav-brand">🔧 Panel del dueño</div>
      <div class="nav-actions">
        <button class="btn btn-outline btn-sm" (click)="toggleTab('jobs')">
          {{ activeTab() === 'jobs' ? '✓ Trabajos' : 'Trabajos' }}
        </button>
        <button class="btn btn-outline btn-sm" (click)="toggleTab('settings')">
          {{ activeTab() === 'settings' ? '✓ Configuración' : 'Configuración' }}
        </button>
        <button class="btn btn-outline btn-sm" (click)="logout()">Salir</button>
      </div>
    </nav>

    <div class="container dashboard-content">
      @if (activeTab() === 'jobs') {
        <div class="jobs-section">
          <h1>📦 Trabajos solicitados</h1>
          @if (jobs().length > 0) {
            <div class="jobs-list">
              @for (job of jobs(); track job.id) {
                <div class="job-card" [class]="'status-' + job.status">
                  <div class="job-top">
                    <div>
                      <h3>Job #{{ job.id }} - {{ job.user?.name }}</h3>
                      <p class="job-desc">{{ job.description }}</p>
                      <p class="job-address">📍 {{ job.address || 'Ubicación no especificada' }}</p>
                    </div>
                    <span [class]="'badge badge-' + job.status">{{
                      formatStatus(job.status)
                    }}</span>
                  </div>
                  <div class="job-actions">
                    @if (job.status === 'pending') {
                      <button
                        class="btn btn-sm btn-primary"
                        (click)="updateJobStatus(job.id, 'in_progress')"
                      >
                        Iniciar
                      </button>
                    } @else if (job.status === 'in_progress') {
                      <button
                        class="btn btn-sm btn-success"
                        (click)="updateJobStatus(job.id, 'completed')"
                      >
                        Completar
                      </button>
                    }
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="updateJobStatus(job.id, 'cancelled')"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="empty">No hay trabajos aún</p>
          }
        </div>
      } @else {
        <div class="settings-section">
          <h1>⚙️ Configuración del negocio</h1>
          <div class="settings-grid">
            @for (setting of settings(); track setting.id) {
              <div class="setting-item">
                <label>{{ setting.label || setting.key }}</label>
                <input
                  type="text"
                  [(ngModel)]="setting.value"
                  class="form-control"
                  placeholder="Haz clic para editar"
                />
              </div>
            }
          </div>
          <button class="btn btn-primary" (click)="saveSettings()">Guardar cambios</button>
        </div>
      }
    </div>
  </div>`,
  styleUrl: './owner-dashboard.component.scss',
})
export class OwnerDashboardComponent implements OnInit {
  private jobsService = inject(JobsService);
  private settingsService = inject(SettingsService);
  auth = inject(AuthService);

  jobs = signal<Job[]>([]);
  settings = signal<Setting[]>([]);
  activeTab = signal<'jobs' | 'settings'>('jobs');

  ngOnInit() {
    this.loadJobs();
    this.loadSettings();
  }

  loadJobs() {
    this.jobsService.getAll().subscribe({
      next: (j) => this.jobs.set(j),
      error: () => this.jobs.set([]),
    });
  }

  loadSettings() {
    this.settingsService.getAll().subscribe({
      next: (s) => this.settings.set(s),
      error: () => this.settings.set([]),
    });
  }

  updateJobStatus(jobId: number, status: JobStatus) {
    this.jobsService.updateStatus(jobId, status).subscribe({
      next: () => this.loadJobs(),
    });
  }

  saveSettings() {
    const toSave = this.settings().map((s) => ({ key: s.key, value: s.value }));
    this.settingsService.updateMany(toSave).subscribe({
      next: () => alert('Configuración actualizada'),
    });
  }

  toggleTab(tab: 'jobs' | 'settings') {
    this.activeTab.set(tab);
  }

  formatStatus(status: JobStatus): string {
    const map: Record<JobStatus, string> = {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return map[status];
  }

  logout() {
    this.auth.logout();
  }
}
