import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento, DepartamentoCreate, DepartamentoUpdate } from '../models/departamento.model';
import { getApiBaseUrl } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private get apiUrl(): string {
    return `${getApiBaseUrl()}/departamentos`;
  }

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los departamentos
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  // GET - Obtener departamento por ID
  getDepartamento(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear departamento
  createDepartamento(departamento: DepartamentoCreate): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, departamento);
  }

  // PUT - Actualizar departamento
  updateDepartamento(id: number, departamento: DepartamentoUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, departamento);
  }

  // DELETE - Eliminar departamento
  deleteDepartamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}