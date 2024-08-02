import { NgModule } from '@angular/core';
import { HomeComponent } from './layout/home/home.component';
import { httpInterceptorProviders } from 'src/app/helpers/http.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/home/components/header/header.component';
import { SidebarComponent } from './layout/home/components/sidebar/sidebar.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { MenuItems } from 'src/app/config/menu-items.config';
import { SharedModulesModule } from 'src/app/shared/modules/shared-modules.module';



@NgModule({
  declarations: [HomeComponent, HeaderComponent, SidebarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    SharedComponentsModule,
    SharedModulesModule
  ],
  exports: [HomeComponent,SharedComponentsModule,HttpClientModule,SharedModulesModule],
  providers: [httpInterceptorProviders,MenuItems],
})
export class CoreModule {}
