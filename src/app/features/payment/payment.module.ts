import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';
import { PaymentComponent } from './payment.component';
import { DialogRegistroPagoComponent } from './components/dialog-registro-pago/dialog-registro-pago.component';
import { DialogDatosBancariosComponent } from './components/dialog-datos-bancarios/dialog-datos-bancarios.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ListPagosAdeudadosComponent } from './components/list-pagos-adeudados/list-pagos-adeudados.component';
import { DialogDatosBancariosGComponent } from './components/dialog-datos-bancarios-g/dialog-datos-bancarios-g.component';


@NgModule({
  declarations: [
    PaymentComponent,
    DialogRegistroPagoComponent,
    DialogDatosBancariosComponent,
    ListPagosAdeudadosComponent,
    DialogDatosBancariosGComponent
  ],
  imports: [
    CommonModule,
    SharedModulesModule,
    PaymentRoutingModule,
    SharedComponentsModule
  ]
})
export class PaymentModule { }
