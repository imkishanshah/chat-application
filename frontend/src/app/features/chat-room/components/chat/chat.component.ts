import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../core/services/shared.service';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  room = 'room1';
  chatForm!: FormGroup;
  messages: any[] = [];
  users: any[] = [];
  selectedUser: any;
  currentUserId: any;
  loggedInUser: any;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private sharedService: SharedService,
    private api: ApiService,
  ) {

  }

  ngOnInit() {

    const currentUser = this.sharedService.getDecodedToken();
    this.loggedInUser = this.sharedService.getUser();

    this.currentUserId = currentUser?.id;
    this.getAllUsers();
    this.createChatForm()
    if (typeof window !== 'undefined') {
      this.socketService.joinRoom(this.room);
      this.socketService.onNewMessage().subscribe(msg => {
        this.messages.push({
          ...msg,
          fromSelf: msg.sender_id === this.currentUserId
        });
      });
    }
  }
  getAllUsers() {
    this.api.get<any>('user').subscribe({
      next: (response) => {
        this.users = response?.data.filter((user: any) => {
          return user.id !== this.currentUserId;
        });
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.room = this.sharedService.getChatRoom(this.currentUserId!, user.id);
    this.messages = []; // Clear old messages

    // Join the new room
    this.socketService.joinRoom(this.room);

    // Fetch message history
    this.socketService.getMessages(this.currentUserId!, user.id).subscribe({
      next: (response: any) => {
        console.log(response);

        this.messages = response?.payload?.data.map((msg: any) => ({
          ...msg,
          fromSelf: msg.sender_id === this.currentUserId
        }));
        console.log(this.messages);

      },
      error: (error) => {
        console.error('Failed to fetch messages:', error);
      }
    });
  }


  createChatForm() {
    this.chatForm = <FormGroup>this.fb.group({
      message: new FormControl(null, Validators.required),
      sender_id: new FormControl(null),
      receiver_id: new FormControl(null),

    })
  }

  sendMessage() {
    const message = this.chatForm.value.message?.trim();

    if (message && this.selectedUser) {
      this.socketService.sendMessage(
        this.room,
        message,
        this.currentUserId,
        this.selectedUser.id
      );

      this.chatForm.reset();
    }
  }

}
