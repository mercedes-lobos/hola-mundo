import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { BoardAdminComponent } from './pages/board-admin/board-admin.component';
import { BoardUserComponent } from './pages/board-user/board-user.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from 'src/app/features/auth/pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';
import { DialogChangePasswordComponent } from './components/dialog-change-password/dialog-change-password.component';


@NgModule({
  declarations: [
    BoardAdminComponent,
    BoardAdminComponent,
    BoardUserComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DialogChangePasswordComponent
  ],
  imports: [CommonModule, AuthRoutingModule, SharedModulesModule],
})
export class AuthModule {}
