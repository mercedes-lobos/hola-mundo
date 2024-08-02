import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public updateProfesionalId(id: number): void {
    let user = this.getUser();
    if (user.profesional.id == null) {
      user.profesional.id = id;
      this.saveUser(user);
    }
  }

  public getToken(): any {
    const authUser = window.sessionStorage.getItem(USER_KEY);
    if (authUser) {
      return JSON.parse(authUser).access_token;
    }
    return {};
  }

  public getRefreshToken(): any {
    const authUser = window.sessionStorage.getItem(USER_KEY);
    if (authUser) {
      return JSON.parse(authUser).refresh_token;
    }
  }

  public updateTokens(token: string, refresh: string): void {
    let user = this.getUser();
    user.access_token = token;
    user.refresh_token = refresh;
    console.log('updateTokens', user);
    this.saveUser(user);
  }
}
