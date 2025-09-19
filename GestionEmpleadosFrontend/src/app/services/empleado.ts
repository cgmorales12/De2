import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado, EmpleadoCreate, EmpleadoUpdate } from '../models/empleado.model';
import { getApiBaseUrl } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private get apiUrl(): string {
    return `${getApiBaseUrl()}/empleados`;
  }

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  // GET - Obtener empleado por ID
  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear empleado
  createEmpleado(empleado: EmpleadoCreate): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  // PUT - Actualizar empleado
  updateEmpleado(id: number, empleado: EmpleadoUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, empleado);
  }

  // DELETE - Eliminar empleado
  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
