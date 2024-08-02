import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { DialogChangePasswordComponent } from 'src/app/features/auth/components/dialog-change-password/dialog-change-password.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  readonly _baseRoute = '../auth/login';

  isLoggedIn = false;
  roles: string[] = [];
  refresh_token!: string;

  constructor(
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
    ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.refresh_token = this.storageService.getUser().refresh_token;
    }
  }

  logout(): void {
    this.authService.logout(this.refresh_token).subscribe({
      next: (res) => {
        //console.log(res);
        this.storageService.clean();
        this.router.navigate([this._baseRoute]).then((res) => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.log(err);
        this.storageService.clean();
        this.router.navigate([this._baseRoute]).then((res) => {
          window.location.reload();
        });
      },
      complete: () => {
        this.cleanLocalStorage();
      },
    });
  }

  cleanLocalStorage(): void {
    localStorage.removeItem('direcciones');
    localStorage.removeItem('titulos');
    localStorage.removeItem('especialidades');
    localStorage.removeItem('cursos');
    localStorage.removeItem('lugarTrabajo');
    localStorage.removeItem('registrosPago');
  }

  openDialogChangePassword() {
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      panelClass: '.modal-responsive',
      minWidth:'40%',
      autoFocus: false,
    });
  }

  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
