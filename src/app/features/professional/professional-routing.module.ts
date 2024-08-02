import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfessionalComponent } from './pages/edit-professional/edit-professional.component';
import { ViewProfessionalComponent } from './pages/view-professional/view-professional.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  { path: '', component: EditProfessionalComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditProfessionalComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: ViewProfessionalComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
