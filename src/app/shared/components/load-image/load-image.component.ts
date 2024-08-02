import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadImageCropperComponent } from '../load-image-cropper/load-image-cropper.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LoadImageComponent,
    },
  ],
})
export class LoadImageComponent {
  file: string = '';
  url: string = '';
  private static id: number = 0;
  componentId: number = 0;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit(): void {
    this.componentId = ++LoadImageComponent.id;

    if (this.route.snapshot.params['id']) {
      this.url = this.route.snapshot.url[0].path;
    }
  }

  writeValue(_file: string): void {
    this.file = _file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange = (fileUrl: string) => {};

  onTouched = () => {};

  disabled: boolean = false;

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      if (files[0].size < 1000000) {
        let _file = URL.createObjectURL(files[0]);
        this.compressImage(_file).then(
          (compressedImageUrl) => {
            // La URL comprimida está disponible aquí
            _file = compressedImageUrl;
          },
          (error) => {
            console.error('Error al comprimir la imagen:', error);
          }
        );
        this.resetInput();
        this.openLoadImageEditor(_file).subscribe((result) => {
          if (result) {
            this.file = result;
            this.onChange(this.file);
          }
        });
      } else {
        console.error('La imagen supera el tamaño autorizado:', files[0].size);
        this.notification('Error', 'La imagen supera el tamaño autorizado de 1Mb', 'error');
      }
    }
  }

  openLoadImageEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(LoadImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  resetInput() {
    const input = document.getElementById('load-image-input-file-' + this.componentId) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  compressImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        this.imageCompress.compressFile(url, -1, 30, 30).then(
          (compressedBase64: string) => {
            // Obtener la subcadena después del prefijo
            const subStringBase64 = compressedBase64.split(',')[1];
            // Convierte el base64 a Blob
            const byteCharacters = atob(subStringBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Obtiene la URL del Blob
            const compressedImageUrl = URL.createObjectURL(blob);

            // Resuelve la promesa con la URL comprimida
            resolve(compressedImageUrl);
          },
          (error) => {
            reject(error);
          }
        );
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
