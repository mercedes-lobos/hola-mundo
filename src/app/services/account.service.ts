import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaTable } from '../features/account/models/tables/cuenta-table.model';

const urlApi = environment.apiUrl;
const version = environment.version;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _httpClient: HttpClient) {}

  //Cuenta
  getCuenta(): Observable<CuentaTable> {
    return this._httpClient.get<CuentaTable>(urlApi + version + '/cuentas/estado-cuenta-profesional/');
  }
}
