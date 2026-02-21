import { Injectable } from '@angular/core';
import { E_STORAGE } from '../enums/storage.enum';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { BehaviorSubject } from 'rxjs';
interface MyJwtPayload extends JwtPayload {
  id: number
  first_name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})


export class SharedService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem(E_STORAGE.TOKEN));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(E_STORAGE.TOKEN);
  }

  setUser(user: any) {
    localStorage.setItem(E_STORAGE.USER, JSON.stringify(user));
    this.userSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  setToken(token: string) {
    localStorage.setItem(E_STORAGE.TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(E_STORAGE.TOKEN);
  }

  clearUser() {
    localStorage.removeItem(E_STORAGE.USER);
    localStorage.removeItem(E_STORAGE.TOKEN);
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getUser(): any {
    const user = localStorage.getItem(E_STORAGE.USER);
    return user ? JSON.parse(user) : null;
  }

  getDecodedToken(): MyJwtPayload | null {
    const token = localStorage.getItem(E_STORAGE.TOKEN);
    return token ? jwtDecode<MyJwtPayload>(token) : null;
  }


  getChatRoom(user1Id: number, user2Id: number): string {
    const sortedIds = [user1Id, user2Id].sort((a, b) => a - b);
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
