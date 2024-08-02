import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { SharedComponentsModule } from '../components/shared-components.module';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from '../directives/accordion';



@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
  ],
  imports: [CommonModule],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
  ],
})
export class SharedModulesModule {}
