import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { LoadImageComponent } from './load-image/load-image.component';
import { LoadImageCropperComponent } from './load-image-cropper/load-image-cropper.component';
import { SharedModulesModule } from '../modules/shared-modules.module';

@NgModule({
  declarations: [
    SpinnerComponent,
    ImageCropperComponent,
    LoadImageComponent,
    LoadImageCropperComponent,
  ],
  imports: [
    CommonModule,
    SharedModulesModule
  ],
  exports:[
    SpinnerComponent,
    ImageCropperComponent,
    LoadImageComponent,
    LoadImageCropperComponent
  ]
})
export class SharedComponentsModule { }
