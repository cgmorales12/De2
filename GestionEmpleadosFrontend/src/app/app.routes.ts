
import { Routes } from '@angular/router';
import { TestConnectionComponent } from './test-connection/test-connection';

export const routes: Routes = [
  { path: '', component: TestConnectionComponent },
  { path: 'test', component: TestConnectionComponent },
  { path: '**', redirectTo: '' }
];
