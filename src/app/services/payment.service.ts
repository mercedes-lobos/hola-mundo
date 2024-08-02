import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegistroPago } from '../features/payment/models/registro-pago.model';
import { Observable } from 'rxjs';
import { RegistroPagoTable } from '../features/payment/models/tables/registro-pago-table.model';
import { Concepto } from '../features/payment/models/concepto.model';
import { Periodo } from '../features/payment/models/periodo.model';
import { Pago } from '../features/payment/models/pago.model';

const urlApi = environment.apiUrl;
const version = environment.version;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private _httpClient: HttpClient) {}

  //Registro de pagos
  postRegistroPagos(registroPagos: RegistroPago): Observable<RegistroPago> {
    return this._httpClient.post<RegistroPago>(urlApi + version + '/registro-pagos/', registroPagos);
  }

  getRegistroPagos(id: number, offSet: number, pageSize: number): Observable<RegistroPagoTable> {
    return this._httpClient.get<RegistroPagoTable>(
      urlApi + version + `/registros-pagos-by-user/`+ id +`/?limit=${pageSize}&offset=${offSet}`
    );
  }

  deleteRegistroPago(id: number): Observable<RegistroPagoTable> {
    return this._httpClient.delete<RegistroPagoTable>(urlApi + version +  '/registro-pagos/'+ id +'/')
  }

  //Pagos
  getPagosAdeudados(): Observable<Pago> {
    return this._httpClient.get<Pago>(urlApi + version + `/list-outstanding-payments/`);
  }

  //Conceptos
  getAllConcepto(): Observable<Concepto[]> {
    return this._httpClient.get<Concepto[]>(urlApi + version + `/conceptos/`);
  }

  //Periodos
  getAllPeriodo(): Observable<Periodo[]> {
    return this._httpClient.get<Periodo[]>(urlApi + version + `/periodos/`);
  }
}
