import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfesionalValidacionRoutingModule } from './profesional-validacion-routing.module';
import { ViewValidacionQrComponent } from './pages/view-validacion-qr/view-validacion-qr.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';


@NgModule({
  declarations: [ViewValidacionQrComponent],
  imports: [CommonModule, SharedModulesModule, SharedComponentsModule, ProfesionalValidacionRoutingModule],
})
export class ProfesionalValidacionModule {}
