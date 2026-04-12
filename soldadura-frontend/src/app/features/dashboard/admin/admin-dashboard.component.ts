import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JobsService } from '../../../core/services/jobs.service';
import { SettingsService } from '../../../core/services/settings.service';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Setting, User, JobStatus } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: ` <div class="dashboard admin-dashboard">
    <nav class="dashboard-nav">
      <div class="nav-brand">⚡ Panel de administrador</div>
      <div class="nav-tabs">
        @for (tab of tabs; track tab) {
          <button class="tab-btn" [class.active]="activeTab() === tab" (click)="activeTab.set(tab)">
            {{
              tab === 'jobs' ? '📦 Trabajos' : tab === 'users' ? '👥 Usuarios' : '⚙️ Configuración'
            }}
          </button>
        }
        <button class="btn btn-outline btn-sm" (click)="logout()">Salir</button>
      </div>
    </nav>

    <div class="container dashboard-content">
      @if (activeTab() === 'jobs') {
        <h1>📦 Gestión de trabajos</h1>
        <div class="jobs-grid">
          @for (job of jobs(); track job.id) {
            <div class="job-card" [class]="'status-' + job.status">
              <div class="job-header">
                <h3>Job #{{ job.id }}</h3>
                <span [class]="'badge badge-' + job.status">{{ formatStatus(job.status) }}</span>
              </div>
              <p><strong>Usuario:</strong> {{ job.user?.name || 'N/A' }}</p>
              <p><strong>Descripción:</strong> {{ job.description.substring(0, 60) }}...</p>
              <div class="job-actions">
                @if (job.status === 'pending') {
                  <button class="btn btn-sm btn-primary" (click)="updateJob(job.id, 'in_progress')">
                    Iniciar
                  </button>
                }
                @if (job.status === 'in_progress') {
                  <button class="btn btn-sm btn-success" (click)="updateJob(job.id, 'completed')">
                    Completar
                  </button>
                }
                <button class="btn btn-sm btn-danger" (click)="updateJob(job.id, 'cancelled')">
                  Cancelar
                </button>
              </div>
            </div>
          }
        </div>
      } @else if (activeTab() === 'users') {
        <h1>👥 Gestión de usuarios</h1>
        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <select
                      (change)="changeRole(user.id, $event)"
                      [value]="user.role"
                      class="form-control-sm"
                    >
                      <option value="user">Usuario</option>
                      <option value="owner">Dueño</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{{ user.isActive ? '✅' : '❌' }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="toggleUser(user.id)">
                      {{ user.isActive ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <h1>⚙️ Configuración del negocio</h1>
        <div class="settings-grid">
          @for (setting of settings(); track setting.id) {
            <div class="setting-item">
              <label>{{ setting.label || setting.key }}</label>
              <input type="text" [(ngModel)]="setting.value" class="form-control" />
            </div>
          }
        </div>
        <button class="btn btn-primary" (click)="saveSettings()">Guardar</button>
      }
    </div>
  </div>`,
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private jobsService = inject(JobsService);
  private settingsService = inject(SettingsService);
  private usersService = inject(UsersService);
  auth = inject(AuthService);

  tabs = ['jobs', 'users', 'settings'];
  activeTab = signal<string>('jobs');
  jobs = signal<Job[]>([]);
  users = signal<User[]>([]);
  settings = signal<Setting[]>([]);

  ngOnInit() {
    this.loadJobs();
    this.loadUsers();
    this.loadSettings();
  }

  loadJobs() {
    this.jobsService.getAll().subscribe({ next: (j) => this.jobs.set(j) });
  }

  loadUsers() {
    this.usersService.getAll().subscribe({ next: (u) => this.users.set(u) });
  }

  loadSettings() {
    this.settingsService.getAll().subscribe({ next: (s) => this.settings.set(s) });
  }

  updateJob(id: number, status: JobStatus) {
    this.jobsService.updateStatus(id, status).subscribe({ next: () => this.loadJobs() });
  }

  changeRole(userId: number, event: any) {
    this.usersService
      .updateRole(userId, event.target.value)
      .subscribe({ next: () => this.loadUsers() });
  }

  toggleUser(userId: number) {
    this.usersService.toggleActive(userId).subscribe({ next: () => this.loadUsers() });
  }

  saveSettings() {
    const toSave = this.settings().map((s) => ({ key: s.key, value: s.value }));
    this.settingsService.updateMany(toSave).subscribe({ next: () => alert('Guardado') });
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
