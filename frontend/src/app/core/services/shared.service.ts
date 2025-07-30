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


  getChatRoom(user1Id: number, user2Id: number): string {
    const sortedIds = [user1Id, user2Id].sort((a, b) => a - b);
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }


}
