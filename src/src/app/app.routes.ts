// ====== ./app/app.routes.ts ======

// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './page_modules/dashboard/dashboard.component';

// redirect for the dashboard page
// Route Configuration
export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/synk-dashboard',
  //   pathMatch: 'full'
  // },
  { path: '', component: DashboardComponent }
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);