import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageCropperComponent } from '../../../../shared/components/image-cropper/image-cropper.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AvatarComponent,
    },
  ],
})
export class AvatarComponent {
  file: string = '';
  url: string ='';

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
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
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openAvatarEditor(_file).subscribe((result) => {
        if (result) {
          this.file = result;
          this.onChange(this.file);
        }
      });
    }
  }

  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
