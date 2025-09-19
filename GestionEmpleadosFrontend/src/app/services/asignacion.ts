import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignacion, AsignacionCreate, AsignacionUpdate } from '../models/asignacion.model';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private apiUrl = `${API_CONFIG.baseUrl}/asignaciones`;

  constructor(private http: HttpClient) { }

  // GET - Obtener todas las asignaciones
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl);
  }

  // GET - Obtener asignación por ID
  getAsignacion(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear asignación
  createAsignacion(asignacion: AsignacionCreate): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, asignacion);
  }

  // PUT - Actualizar asignación
  updateAsignacion(id: number, asignacion: AsignacionUpdate): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}/${id}`, asignacion);
  }

  // DELETE - Eliminar asignación
  deleteAsignacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}