import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ServiceObservabilityComponent } from './pages/service_observability/service-observability/service-observability.component';
 import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { guestGuard, roleGuard } from './guards/auth.guard';
import { CommandCenterComponent } from './pages/command_center/command-center/command-center.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'command-center',
    component: CommandCenterComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'incidents',
    component: IncidentsComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'services',
    component: ServiceObservabilityComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  { path: '**', redirectTo: 'login' },
];