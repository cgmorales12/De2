export interface Asignacion {
  asignacion_id: number;
  empleado_id: number;
  departamento_id: number;
  fecha_asignacion: string;
  estado: string;
  empleado_nombre_completo: string;
  departamento_nombre: string;
}

export interface AsignacionCreate {
  empleado_id: number;
  departamento_id: number;
}

export interface AsignacionUpdate {
  estado: string;
}