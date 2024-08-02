import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListPagosAdeudadosComponent } from './components/list-pagos-adeudados/list-pagos-adeudados.component';

const routes: Routes = [
  { path: 'registro-pagos', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'pagos-adeudados', component: ListPagosAdeudadosComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
