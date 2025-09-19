import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoService } from '../services/departamento';
import { Departamento } from '../models/departamento.model';

interface DepartamentoForm {
  departamento_id?: number;
  nombre: string;
  ubicacion: string;
  jefe_departamento?: string;
  extension?: string;
}

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];
  loading = false;
  error: string | null = null;
  saving = false;
  form: DepartamentoForm = this.createEmptyForm();

  constructor(private readonly departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.loading = true;
    this.error = null;

    this.departamentoService.getDepartamentos().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos;
        this.loading = false;
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
        this.loading = false;
      }
    });
  }

  editarDepartamento(departamento: Departamento): void {
    this.form = {
      departamento_id: departamento.departamento_id,
      nombre: departamento.nombre,
      ubicacion: departamento.ubicacion,
      jefe_departamento: departamento.jefe_departamento ?? '',
      extension: departamento.extension ?? ''
    };
  }

  eliminarDepartamento(departamento: Departamento): void {
    if (!confirm(`¿Deseas eliminar el departamento "${departamento.nombre}"?`)) {
      return;
    }

    this.departamentoService.deleteDepartamento(departamento.departamento_id).subscribe({
      next: () => {
        this.departamentos = this.departamentos.filter((d) => d.departamento_id !== departamento.departamento_id);
      },
      error: (error) => {
        this.error = this.parseHttpError(error);
      }
    });
  }

  guardarDepartamento(): void {
    if (!this.form.nombre?.trim() || !this.form.ubicacion?.trim()) {
      this.error = 'El nombre y la ubicación son obligatorios.';
      return;
    }

    this.saving = true;
    this.error = null;

    if (this.form.departamento_id) {
      const payload = {
        departamento_id: this.form.departamento_id,
        nombre: this.form.nombre,
        ubicacion: this.form.ubicacion,
        jefe_departamento: this.form.jefe_departamento || '',
        extension: this.form.extension || ''
      };

      this.departamentoService.updateDepartamento(this.form.departamento_id, payload).subscribe({
        next: () => {
          this.cargarDepartamentos();
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
        ubicacion: this.form.ubicacion,
        jefe_departamento: this.form.jefe_departamento || '',
        extension: this.form.extension || ''
      };

      this.departamentoService.createDepartamento(payload).subscribe({
        next: (departamento) => {
          this.departamentos = [...this.departamentos, departamento];
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

  private createEmptyForm(): DepartamentoForm {
    return {
      nombre: '',
      ubicacion: '',
      jefe_departamento: '',
      extension: ''
    };
  }

  private parseHttpError(error: any): string {
    if (error?.status === 0) {
      return 'No fue posible conectar con el backend. Verifica que la API esté en ejecución.';
    }

    return error?.error ?? error?.message ?? 'Error desconocido';
  }
}
