import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Password } from '../models/password.model';
import { StorageService } from './storage.service';

const urlApi = environment.apiUrl;
const version = environment.version;
const AUTH_API = '/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private _httpClient: HttpClient,
    private storageService: StorageService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      urlApi + AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string, password2: string): Observable<any> {
    return this.http.post(
      urlApi + AUTH_API + 'signup',
      {
        username,
        email,
        password,
        password2,
      },
      httpOptions
    );
  }

  logout(refresh_token: string): Observable<any> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    return this.http.post(
      urlApi + AUTH_API + 'signout',
      {
        refresh_token,
      },
      httpOptions
    );
  }

  //Change Password
  putChangePassword(changePassword: Password, id: number): Observable<Password> {
    return this._httpClient.put<Password>(urlApi + version + '/change_password/' + id + '/', changePassword);
  }

  refreshAccessToken(): Observable<any> {
    // Call the refresh token endpoint to get a new access token
    const refresh = this.storageService.getRefreshToken();
    console.log('refresh_token', refresh);
    return this.http.post<any>(urlApi + AUTH_API + 'refresh', { refresh });
  }
}
