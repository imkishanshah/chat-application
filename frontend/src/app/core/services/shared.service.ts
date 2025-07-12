import { Injectable } from '@angular/core';
import { E_STORAGE } from '../enums/storage.enum';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {

  }

  setUser(user: any) {
    localStorage.setItem(E_STORAGE.USER, JSON.stringify(user));
  }

  setToken(token: string) {
    localStorage.setItem(E_STORAGE.TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(E_STORAGE.TOKEN);
  }

  getUser(): any {
    const user = localStorage.getItem(E_STORAGE.USER);
    return user ? JSON.parse(user) : null;
  }
}
