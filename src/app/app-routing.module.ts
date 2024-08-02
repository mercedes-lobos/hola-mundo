import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/core/layout/home/home.component';
import { AuthGuard } from './features/auth/guards/auth.guard';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule) },
  {
    path: 'profesional',
    loadChildren: () => import('./features/professional/professional.module').then((n) => n.ProfessionalModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'pagos',
    loadChildren: () => import('./features/payment/payment.module').then((n) => n.PaymentModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./features/account/account.module').then((n) => n.AccountModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'documentos',
    loadChildren: () => import('./features/documents/documents.module').then((n) => n.DocumentsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'validate-qr',
    loadChildren: () =>
      import('./features/profesional-validacion/profesional-validacion.module').then(
        (n) => n.ProfesionalValidacionModule
      ),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
