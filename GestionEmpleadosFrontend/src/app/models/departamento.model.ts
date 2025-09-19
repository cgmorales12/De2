export interface Departamento {
  departamento_id: number;
  nombre: string;
  ubicacion: string;
  jefe_departamento?: string;
  extension?: string;
}

export interface DepartamentoCreate {
  nombre: string;
  ubicacion: string;
  jefe_departamento?: string;
  extension?: string;
}

export interface DepartamentoUpdate {
  departamento_id: number;
  nombre: string;
  ubicacion: string;
  jefe_departamento?: string;
  extension?: string;
}