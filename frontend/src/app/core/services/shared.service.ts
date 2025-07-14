import { Injectable } from '@angular/core';
import { E_STORAGE } from '../enums/storage.enum';
import { jwtDecode, JwtPayload } from "jwt-decode";
interface MyJwtPayload extends JwtPayload {
  id: number
  first_name?: string;
  email?: string;
}

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

  getDecodedToken(): MyJwtPayload | null {
    const token = localStorage.getItem(E_STORAGE.TOKEN);
    return token ? jwtDecode<MyJwtPayload>(token) : null;
  }


  getChatRoom(userId1: number, userId2: number): string {
    console.log(userId1, userId2);

    const [a, b] = [userId1, userId2].sort((x, y) => x - y);
    return `room-${a}-${b}`;
  }

}
