import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;
  private readonly baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.socket = io(this.baseUrl, {
        transports: ['websocket'],
        withCredentials: true
      });
    }
  }

  joinRoom(room: string) {
    this.socket?.emit('joinRoom', room);
  }

  sendMessage(room: string, message: string, senderId: number, receiverId: number) {
    this.socket?.emit('sendMessage', {
      room,
      message,
      senderId,
      receiverId
    });
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('newMessage', (message) => {
        observer.next(message);
      });
    });
  }

  getMessages(user1Id: number, user2Id: number) {
    // Use the full API URL
    return this.http.post<any[]>(`${this.baseUrl}/user/messages`, { user1Id, user2Id });
  }

}
