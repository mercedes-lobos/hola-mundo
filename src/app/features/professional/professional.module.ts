import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { EditProfessionalComponent } from './pages/edit-professional/edit-professional.component';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';
import { DialogTituloComponent } from './components/dialog-titulo/dialog-titulo.component';
import { DialogDireccionComponent } from './components/dialog-direccion/dialog-direccion.component';
import { ViewProfessionalComponent } from './pages/view-professional/view-professional.component';
import { DialogEspecialidadComponent } from './components/dialog-especialidad/dialog-especialidad.component';
import { DialogCursoComponent } from './components/dialog-curso/dialog-curso.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { DialogLugarTrabajoComponent } from './components/dialog-lugar-trabajo/dialog-lugar-trabajo.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

@NgModule({
  declarations: [
    EditProfessionalComponent,
    DialogTituloComponent,
    DialogDireccionComponent,
    ViewProfessionalComponent,
    DialogEspecialidadComponent,
    DialogCursoComponent,
    AvatarComponent,
    DialogLugarTrabajoComponent
  ],
  imports: [
    CommonModule,
    SharedModulesModule,
    ProfessionalRoutingModule,
    SharedComponentsModule
  ]
})
export class ProfessionalModule {}
