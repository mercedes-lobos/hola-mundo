import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';
import { DocumentsComponent } from './documents.component';

@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    SharedModulesModule,
    DocumentsRoutingModule,
  ]
})
export class DocumentsModule {}
