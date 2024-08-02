import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ValidateResponse } from '../features/profesional-validacion/models/validate-response.model';
import { IQrData } from '../features/profesional-validacion/models/qr-data.model';
import { Observable } from 'rxjs';

const urlApi = environment.apiUrl;
const version = environment.version;
@Injectable({
  providedIn: 'root',
})
export class ProfesionalValidacionService {

  constructor(private _httpClient: HttpClient) {}

  postProfesional(qrData: IQrData): Observable<ValidateResponse> {
    return this._httpClient.post<ValidateResponse>(urlApi + version + '/reportes/validate-qr-code/', qrData);
  }
}
