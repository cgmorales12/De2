import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentoService } from '../services/departamento';
import { EmpleadoService } from '../services/empleado';
import { Departamento } from '../models/departamento.model';
import { Empleado } from '../models/empleado.model';
import { API_CONFIG } from '../services/api.config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>🔗 Prueba de Conexión Backend - Frontend</h2>

      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>📋 Departamentos</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-primary mb-3" (click)="cargarDepartamentos()">
                Cargar Departamentos
              </button>

              <div *ngIf="loading" class="text-info">
                Cargando...
              </div>

              <div *ngIf="error" class="alert alert-danger">
                Error: {{ error }}
              </div>

              <div *ngIf="departamentos.length > 0">
                <h6>Total: {{ departamentos.length }} departamentos</h6>
                <ul class="list-group">
                  <li *ngFor="let dept of departamentos" class="list-group-item">
                    <strong>{{ dept.nombre }}</strong><br>
                    <small>{{ dept.ubicacion }} - {{ dept.jefe_departamento }}</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>👥 Empleados</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-success mb-3" (click)="cargarEmpleados()">
                Cargar Empleados
              </button>

              <div *ngIf="loadingEmpleados" class="text-info">
                Cargando empleados...
              </div>

              <div *ngIf="errorEmpleados" class="alert alert-danger">
                Error: {{ errorEmpleados }}
              </div>

              <div *ngIf="empleados.length > 0">
                <h6>Total: {{ empleados.length }} empleados</h6>
                <ul class="list-group">
                  <li *ngFor="let emp of empleados" class="list-group-item">
                    <strong>{{ emp.nombre }} {{ emp.apellido }}</strong><br>
                    <small>{{ emp.email }} - {{ emp.telefono }}</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>ℹ️ Estado de la Conexión</h5>
            </div>
            <div class="card-body">
              <p><strong>URL del Backend:</strong> {{ backendUrl }}</p>
              <div class="row g-2 align-items-end">
                <div class="col-md-6">
                  <label for="backendUrlSelect" class="form-label">Selecciona la URL a utilizar</label>
                  <select
                    id="backendUrlSelect"
                    class="form-select"
                    [(ngModel)]="backendUrl"
                    (ngModelChange)="onBackendUrlChange($event)"
                  >
                    <option *ngFor="let option of backendOptions" [ngValue]="option.url">
                      {{ option.label }} - {{ option.url }}
                    </option>
                  </select>
                  <small class="text-muted">La selección se guarda en este navegador.</small>
                </div>
                <div class="col-md-6 d-flex gap-2">
                  <button type="button" class="btn btn-outline-secondary" (click)="resetBackendUrl()">
                    Restaurar detección automática
                  </button>
                  <button type="button" class="btn btn-outline-primary" (click)="probarNuevamente()">
                    Probar nuevamente
                  </button>
                </div>
              </div>
              <p><strong>Estado:</strong>
                <span *ngIf="!error && !errorEmpleados" class="text-success">✅ Conexión OK</span>
                <span *ngIf="error || errorEmpleados" class="text-danger">❌ Error de conexión</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 20px;
    }
    .list-group-item {
      border: 1px solid #dee2e6;
      margin-bottom: 5px;
    }
  `]
})
export class TestConnectionComponent implements OnInit {
  departamentos: Departamento[] = [];
  empleados: Empleado[] = [];
  loading = false;
  loadingEmpleados = false;
  error: string | null = null;
  errorEmpleados: string | null = null;
  backendOptions = API_CONFIG.availableUrls;
  backendUrl = API_CONFIG.baseUrl;

  constructor(
    private departamentoService: DepartamentoService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    // Cargar datos automáticamente al iniciar
    this.cargarDepartamentos();
    this.cargarEmpleados();
  }

  onBackendUrlChange(url: string): void {
    API_CONFIG.setBaseUrl(url);
    this.backendUrl = API_CONFIG.baseUrl;
    this.probarNuevamente();
  }

  resetBackendUrl(): void {
    API_CONFIG.clearStoredBaseUrl();
    this.backendUrl = API_CONFIG.baseUrl;
    this.probarNuevamente();
  }

  probarNuevamente(): void {
    this.cargarDepartamentos();
    this.cargarEmpleados();
  }

  cargarDepartamentos(): void {
    this.loading = true;
    this.error = null;

    this.departamentoService.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
        this.loading = false;
        console.log('Departamentos cargados:', data);
      },
      error: (err) => {
        this.error = this.parseError(err, 'departamentos');
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  cargarEmpleados(): void {
    this.loadingEmpleados = true;
    this.errorEmpleados = null;

    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.loadingEmpleados = false;
        console.log('Empleados cargados:', data);
      },
      error: (err) => {
        this.errorEmpleados = this.parseError(err, 'empleados');
        this.loadingEmpleados = false;
        console.error('Error:', err);
      }
    });
  }

  private parseError(err: any, recurso: string): string {
    if (err?.status === 0) {
      return `No fue posible conectar con el backend al consultar ${recurso}. Verifica que la API esté en ejecución e intenta con la opción "HTTPS (puerto 7061)" si tu backend usa certificados de desarrollo o selecciona la URL correcta en la lista.`;
    }

    if (err?.error instanceof ErrorEvent) {
      return `Error de red al consultar ${recurso}: ${err.error.message}`;
    }

    return `Error ${err?.status ?? 'desconocido'} al consultar ${recurso}: ${err?.message ?? 'sin mensaje adicional'}`;
  }
}
