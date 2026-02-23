import { computed, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from './socket.service';
import { ApiService } from '../../../core/services/api.service';
import { SharedService } from '../../../core/services/shared.service';
import { Message, User } from '../types/chat.types';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages = signal<Message[]>([]);
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  currentUserId = signal<number | null>(null);
  onlineUsersIds = signal<number[]>([]);
  room = signal<string>('room1');
  searchQuery = signal<string>('');
  isTyping = signal<boolean>(false);
  typingUser = signal<string>('');

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.users().filter(user =>
      user.first_name.toLowerCase().includes(query)
    );
  });

  private typingTimeout: any;
  private typingSubscription?: Subscription;
  private stopTypingSubscription?: Subscription;

  constructor(
    private _socketService: SocketService,
    private _apiService: ApiService,
    private sharedService: SharedService
  ) { }

  // ================= INIT =================
  init() {
    const currentUser = this.sharedService.getDecodedToken();
    this.currentUserId.set(currentUser?.id ?? null);

    this._getAllUsers();
    this._initSocket();
    this._initTypingListeners();
  }
 
  // Called on destroy
  destroy() {
    this.typingSubscription?.unsubscribe();
    this.stopTypingSubscription?.unsubscribe();
    clearTimeout(this.typingTimeout);
  }

  
  private _initSocket() {
    if (!this.currentUserId()) return;

    this._socketService.emitAddUser(this.currentUserId()!);

    this._socketService.onGetOnlineUsers().subscribe(userIds => {
      this.onlineUsersIds.set(userIds);
    });

    this._socketService.onNewMessage().subscribe(msg => {
      this.messages.update(prev => [
        ...prev,
        {
          ...msg,
          fromSelf: msg.sender_id === this.currentUserId()
        }
      ]);
    });
  }

  private _getAllUsers() {
    this._apiService.get<any>('user').subscribe({
      next: (response) => {
        this.users.set(
          response?.data.filter(
            (user: User) => user.id !== this.currentUserId()
          )
        );
      }
    });
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    this.room.set(
      this.sharedService.getChatRoom(
        this.currentUserId()!,
        user.id
      )
    );

    this.messages.set([]);
    this._socketService.joinRoom(this.room());

    this._socketService
      .getMessages(this.currentUserId()!, user.id)
      .subscribe((response: any) => {
        this.messages.set(
          response?.payload?.data.map((msg: Message) => ({
            ...msg,
            fromSelf: msg.sender_id === this.currentUserId()
          }))
        );
      });
  }

  // ================= SEND MESSAGE =================
  sendMessage(message: string) {
    if (!message || !this.selectedUser()) return;

    this._socketService.sendMessage(
      this.room(),
      message,
      this.currentUserId()!,
      this.selectedUser()!.id
    );
  }

  // ================= TYPING =================
  private _initTypingListeners() {
    this.typingSubscription = this._socketService
      .onTyping()
      .subscribe((data: any) => {
        this.typingUser.set(data.user);
        this.isTyping.set(true);
      });

    this.stopTypingSubscription = this._socketService
      .onStopTyping()
      .subscribe(() => {
        this.isTyping.set(false);
        this.typingUser.set('');
      });
  }

  public handleMyTyping(value: string) {
    if (!value) {
      this._socketService.sendStopTyping(this.room());
      return;
    }

    const myName =
      this.sharedService.getDecodedToken()?.first_name || 'User';

    this._socketService.sendTyping(this.room(), myName);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this._socketService.sendStopTyping(this.room()); 
    }, 3000);
  }
}
