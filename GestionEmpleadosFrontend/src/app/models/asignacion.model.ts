import { Departamento } from './departamento.model';
import { Empleado } from './empleado.model';

export interface Asignacion {
  asignacion_id: number;
  empleado_id: number;
  departamento_id: number;
  fecha_asignacion: string;
  estado: string;
  empleado?: Empleado;
  departamento?: Departamento;
}

export interface AsignacionCreate {
  empleado_id: number;
  departamento_id: number;
  fecha_asignacion?: string;
  estado?: string;
}

export interface AsignacionUpdate {
  asignacion_id: number;
  empleado_id: number;
  departamento_id: number;
  fecha_asignacion: string;
  estado: string;
}