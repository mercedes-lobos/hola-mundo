import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from '../account/account.component';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';


@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    SharedModulesModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
