export interface Empleado {
  empleado_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

export interface EmpleadoCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

export interface EmpleadoUpdate {
  empleado_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}