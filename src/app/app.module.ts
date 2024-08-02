import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core/core.module';
import { CommonModule } from '@angular/common';
import { SharedModulesModule } from './shared/modules/shared-modules.module';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es-Ar');
@NgModule({
  providers: [
    {provide: LOCALE_ID, useValue: 'es-AR'},
  ],
  declarations: [AppComponent],
  imports: [
    CoreModule,
    CommonModule,
    AppRoutingModule
  ],
  exports:[CoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
