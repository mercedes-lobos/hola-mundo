import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Cuenta } from './models/cuenta.model';
import { CuentaTable } from './models/tables/cuenta-table.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor(
    private accountService: AccountService
  ) {}

  cuenta: Cuenta[] = [];
  numeroCuenta!: string;
  estadoCuenta!: string;
  saldoCuenta!: number;

  ngOnInit(): void {
    this.accountService.getCuenta().subscribe({
      next: (res) => {
        this.cuenta = (res as unknown as CuentaTable).results;
      },
      error: (err) => {
        console.log(err);
        if(err.status !== 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información de la cuenta.'
          });
        }
      },
      complete: () => {
        this.numeroCuenta = this.cuenta[0].numero_cuenta;
        this.estadoCuenta = this.cuenta[0].estado_cuenta;
        this.saldoCuenta = this.cuenta[0].saldo;
      },
    });
  }
}
