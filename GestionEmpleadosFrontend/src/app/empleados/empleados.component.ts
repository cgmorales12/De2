import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../services/empleado';
import { Empleado } from '../models/empleado.model';

interface EmpleadoForm {
  empleado_id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  loading = false;
  error: string | null = null;
  saving = false;
  form: EmpleadoForm = this.createEmptyForm();

  constructor(private readonly empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.loading = true;
    this.error = null;

    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.loading = false;
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
        this.loading = false;
      }
    });
  }

  editarEmpleado(empleado: Empleado): void {
    this.form = {
      empleado_id: empleado.empleado_id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      telefono: empleado.telefono ?? ''
    };
  }

  eliminarEmpleado(empleado: Empleado): void {
    if (!confirm(`¿Deseas eliminar al empleado "${empleado.nombre} ${empleado.apellido}"?`)) {
      return;
    }

    this.empleadoService.deleteEmpleado(empleado.empleado_id).subscribe({
      next: () => {
        this.empleados = this.empleados.filter((e) => e.empleado_id !== empleado.empleado_id);
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });
  }

  guardarEmpleado(): void {
    if (!this.form.nombre?.trim() || !this.form.apellido?.trim() || !this.form.email?.trim()) {
      this.error = 'Nombre, apellido y correo electrónico son obligatorios.';
      return;
    }

    this.saving = true;
    this.error = null;

    if (this.form.empleado_id) {
      const payload = {
        empleado_id: this.form.empleado_id,
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        email: this.form.email,
        telefono: this.form.telefono || ''
      };

      this.empleadoService.updateEmpleado(this.form.empleado_id, payload).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.resetForm();
        },
        error: (error) => {
          this.error = this.parseHttpError(error);
          this.saving = false;
        }
      });
    } else {
      const payload = {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        email: this.form.email,
        telefono: this.form.telefono || ''
      };

      this.empleadoService.createEmpleado(payload).subscribe({
        next: (empleado) => {
          this.empleados = [...this.empleados, empleado];
          this.resetForm();
        },
        error: (error) => {
          this.error = this.parseHttpError(error);
          this.saving = false;
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form = this.createEmptyForm();
    this.saving = false;
  }

  private createEmptyForm(): EmpleadoForm {
    return {
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
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
