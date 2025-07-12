import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;
  private readonly baseUrl = 'http://localhost:3001';

  constructor() {
    if (typeof window !== 'undefined') {
      this.socket = io(this.baseUrl);
    }
  }

  joinRoom(room: string) {
    this.socket?.emit('joinRoom', room);
  }

  sendMessage(room: string, message: string) {
    this.socket?.emit('sendMessage', { room, message });
  }

  onNewMessage(): Observable<string> {
    return new Observable(observer => {
      this.socket?.on('newMessage', (message: string) => {
        observer.next(message);
      });
    });
  }
}
