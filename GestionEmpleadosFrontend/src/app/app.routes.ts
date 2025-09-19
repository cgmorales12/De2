
import { Routes } from '@angular/router';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AsignacionesComponent } from './asignaciones/asignaciones.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'departamentos' },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'asignaciones', component: AsignacionesComponent },
  { path: '**', redirectTo: 'departamentos' }
];
