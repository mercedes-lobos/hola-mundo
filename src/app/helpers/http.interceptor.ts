import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.storageService.getToken()) {
      request = this.addToken(request, this.storageService.getToken());
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (request.url.includes('/auth/refresh')) {
            return throwError(() => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'El tiempo de su sesión ha finalizado',
                footer: 'Por favor inicie sesión nuevamente',
                showConfirmButton: false,
                timer: 2500,
              }).then((result) => {
                this.storageService.clean();
                this.router.navigateByUrl('/auth/login');
                window.location.reload();
              });
            });
          } else {
            return this.handle401Error(request, next);
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    if (!request.url.includes('/reportes/validate-qr-code/'))
      return request.clone({
        withCredentials: true,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    else
      return request.clone({
        withCredentials: false
      });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((responseTokens) => {
          this.isRefreshing = false;
          this.storageService.updateTokens(responseTokens.access, responseTokens.refresh);
          this.refreshTokenSubject.next(responseTokens.access);
          return next.handle(this.addToken(request, responseTokens.access));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }];
