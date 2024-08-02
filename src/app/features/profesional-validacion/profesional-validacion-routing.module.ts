import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewValidacionQrComponent } from './pages/view-validacion-qr/view-validacion-qr.component';

const routes: Routes = [
  { path: '', component: ViewValidacionQrComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesionalValidacionRoutingModule { }
