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
  chatForm: FormGroup;
  messages: string[] = [];
  users: any[] = [];
  selectedUser: any;
  currentUserId: any;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private sharedService: SharedService,
    private api: ApiService,
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    const currentUser = this.sharedService.getDecodedToken();
    console.log(currentUser);

    this.currentUserId = currentUser?.id
    this.getAllUsers();
    if (typeof window !== 'undefined') {
      this.socketService.joinRoom(this.room);
      this.socketService.onNewMessage().subscribe(msg => {
        console.log(msg);

        this.messages.push(msg);
      });
    }

  }

  getAllUsers() {
    this.api.get<any>('user').subscribe({
      next: (response) => {
        this.users = response?.data;
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;

    // Create a consistent room ID
    this.room = this.sharedService.getChatRoom(this.currentUserId!, user.id);
    console.log(this.selectedUser, this.room);

    this.messages = []; // Clear old messages

    // Join the selected room
    this.socketService.joinRoom(this.room);

    // Optionally fetch previous chat history here
  }


  createChatForm() {
    this.chatForm = <FormGroup>this.fb.group({
      message: new FormControl(null, Validators.required),
      sender_id: new FormControl(null),
      receiver_id: new FormControl(null),

    })
  }

  sendMessage() {
    const message = this.chatForm.value.message.trim();
    if (message) {
      this.socketService.sendMessage(this.room, message);
      this.chatForm.reset(); // clear input field
    }
  }
}
