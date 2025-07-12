import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.socketService.joinRoom(this.room);
      this.socketService.onNewMessage().subscribe(msg => {
        this.messages.push(msg);
      });
    }
  }

  sendMessage() {
    const message = this.chatForm.value.message.trim();
    if (message) {
      this.socketService.sendMessage(this.room, message);
      this.chatForm.reset(); // clear input field
    }
  }
}
