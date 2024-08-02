import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BoardAdminComponent } from './pages/board-admin/board-admin.component';
import { BoardModeratorComponent } from './pages/board-moderator/board-moderator.component';
import { BoardUserComponent } from './pages/board-user/board-user.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { environment } from 'src/environments/environment';

let routes: Routes = [];
if (environment.production) {
  routes = [
    { path: "login", component: LoginComponent },
  ];
} else {
  routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "profile", component: ProfileComponent },
    { path: "user", component: BoardUserComponent },
    { path: "mod", component: BoardModeratorComponent },
    { path: "admin", component: BoardAdminComponent },
  ];
}
// const routes: Routes = [
//   { path: "login", component: LoginComponent },
//   { path: "register", component: RegisterComponent },
//   { path: "profile", component: ProfileComponent },
//   { path: "user", component: BoardUserComponent },
//   { path: "mod", component: BoardModeratorComponent },
//   { path: "admin", component: BoardAdminComponent },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
