import { Password } from './../../../../models/password.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { passwordNotDifferent } from './validators/passwordNotDifferent';
import { passwordMatching } from './validators/passwordMatching';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  id!: number;
  changePassword!: Password;
  errorMessage!: string;
  listError!: [];
  hide1 = true;
  hide2 = true;
  hide3 = true;

  //Form
  changePasswordForm!: FormGroup;

  ngOnInit(): void {
    this.id = this.storageService.getUser().user.id;

    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),
        ]
      ],
      password2: ['', Validators.required ]
    },
    {
      validators: [passwordNotDifferent, passwordMatching]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setChangePassword(changePasswordForm: FormGroup) {
    this.changePassword = new Password();
    this.changePassword.old_password = changePasswordForm.value.old_password;
    this.changePassword.password = changePasswordForm.value.password;
    this.changePassword.password2 = changePasswordForm.value.password2;
  }

  onSaveChangePassword(): void {
    this.setChangePassword(this.changePasswordForm);

    this.authService.putChangePassword(this.changePassword, this.id).subscribe({
      next: (res) => {
        this.notification('Nueva contraseña', 'Actualizada correctamente', 'success');
        this.router.navigate(['profesional/view' + `/${this.id}`]).then((res) => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.error(err);

        if (err.error.old_password) {
          this.errorMessage = err.error.old_password.old_password;
          this.notification('Error', this.errorMessage, 'error');
        }
        else if (err.error.password) {
          this.listError = err.error.password;

          this.listError.forEach(element => {
            this.errorMessage = element;
            this.notification('Error', this.errorMessage, 'error');
          });
        }
        else {
          if(err.status !== 401)
            this.notification('Error', 'Error al guardar la nueva contraseña', 'error');
        }
      },
    });
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
