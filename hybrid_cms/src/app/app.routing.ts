import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ModuleWithProviders } from '@angular/core';

import { StripPackagesComponent } from './strip-packages/strip-packages.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'pages/page-404' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
// export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });

