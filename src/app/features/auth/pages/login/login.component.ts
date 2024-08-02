import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { StorageService } from '../../../../services/storage.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { DialogChangePasswordComponent } from 'src/app/features/auth/components/dialog-change-password/dialog-change-password.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss'] TODO: revisar archivo scss antes de eliminar
})
export class LoginComponent implements OnInit {
  readonly _baseRoute = '../profesional';
  readonly _viewRoute = '/view';

  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user!: User;
  profesionalId!: number;
  isFirstLogin!: boolean;
  hide = true;

  @ViewChild('cardLogin') cardLogin!: ElementRef;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    private renderer2: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles; //TODO: revisar este código
      this.user = this.storageService.getUser().user;
      this.profesionalId = this.storageService.getUser().profesional.id;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    if (username && password != null) {
      this.authService.login(username, password).subscribe({
        next: (data) => {
          this.cleanLocalStorage();
          this.storageService.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.user = this.storageService.getUser().user;
          // this.isFirstLogin =
          //   this.storageService.getUser().user.change_password_first_login;
          this.isFirstLogin == false;
          this.profesionalId = this.storageService.getUser().profesional.id;

          if (this.isFirstLogin == true) {
            const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
              panelClass: '.modal-responsive',
              minWidth:'40%',
              autoFocus: false,
              disableClose: true,
            });

            const ocultarCard = this.cardLogin.nativeElement;
            this.renderer2.setStyle(ocultarCard, 'display', 'none');
          } else {
            this.reloadPage();
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          this.notification('Login', 'Usuario o Clave incorrectos', 'error');
        },
      });
    }
  }

  reloadPage(): void {
    if (this.profesionalId != null) {
      this.router
        .navigate([
          this._baseRoute + this._viewRoute + `/${this.profesionalId}`,
        ])
        .then((res) => {
          window.location.reload();
        });
    } else {
      this.router.navigate([this._baseRoute]).then((res) => {
        window.location.reload();
      });
    }
  }

  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }

  cleanLocalStorage(): void {
    localStorage.removeItem('direcciones');
    localStorage.removeItem('titulos');
    localStorage.removeItem('especialidades');
    localStorage.removeItem('cursos');
    localStorage.removeItem('lugarTrabajo');
    localStorage.removeItem('registrosPago');
  }
}
