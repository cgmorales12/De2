import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsignacionService } from '../services/asignacion';
import { DepartamentoService } from '../services/departamento';
import { EmpleadoService } from '../services/empleado';
import { Asignacion } from '../models/asignacion.model';
import { Departamento } from '../models/departamento.model';
import { Empleado } from '../models/empleado.model';

interface NuevaAsignacionForm {
  empleado_id: number | null;
  departamento_id: number | null;
}

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  departamentos: Departamento[] = [];
  empleados: Empleado[] = [];
  loading = false;
  error: string | null = null;
  saving = false;
  form: NuevaAsignacionForm = this.createEmptyForm();

  constructor(
    private readonly asignacionService: AsignacionService,
    private readonly departamentoService: DepartamentoService,
    private readonly empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = null;

    this.asignacionService.getAsignaciones().subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones;
        this.loading = false;
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
        this.loading = false;
      }
    });

    this.departamentoService.getDepartamentos().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos;
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });

    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });
  }

  crearAsignacion(): void {
    if (this.form.empleado_id === null || this.form.departamento_id === null) {
      this.error = 'Debes seleccionar un empleado y un departamento.';
      return;
    }

    this.saving = true;
    this.error = null;

    this.asignacionService.createAsignacion({
      empleado_id: this.form.empleado_id,
      departamento_id: this.form.departamento_id
    }).subscribe({
      next: (asignacion) => {
        this.asignaciones = [...this.asignaciones, asignacion];
        this.resetForm();
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
        this.saving = false;
      }
    });
  }

  actualizarEstado(asignacion: Asignacion, nuevoEstado: 'Activa' | 'Inactiva'): void {
    if (asignacion.estado === nuevoEstado) {
      return;
    }

    this.asignacionService.updateAsignacion(asignacion.asignacion_id, {
      estado: nuevoEstado
    }).subscribe({
      next: () => {
        this.asignaciones = this.asignaciones.map((item) =>
          item.asignacion_id === asignacion.asignacion_id
            ? { ...item, estado: nuevoEstado }
            : item
        );
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });
  }

  eliminarAsignacion(asignacion: Asignacion): void {
    if (!confirm(`¿Deseas eliminar la asignación de ${asignacion.empleado_nombre_completo} en ${asignacion.departamento_nombre}?`)) {
      return;
    }

    this.asignacionService.deleteAsignacion(asignacion.asignacion_id).subscribe({
      next: () => {
        this.asignaciones = this.asignaciones.filter((item) => item.asignacion_id !== asignacion.asignacion_id);
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });
  }

  private resetForm(): void {
    this.form = this.createEmptyForm();
    this.saving = false;
  }

  private createEmptyForm(): NuevaAsignacionForm {
    return {
      empleado_id: null,
      departamento_id: null
    };
  }

  private parseHttpError(error: any): string {
    if (error?.status === 0) {
      return 'No fue posible conectar con el backend. Verifica que la API esté en ejecución.';
    }

    if (error?.status === 400 && typeof error.error === 'string') {
      return error.error;
    }

    return error?.error ?? error?.message ?? 'Error desconocido';
  }
}
