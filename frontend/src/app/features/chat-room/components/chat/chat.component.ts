import { ChangeDetectionStrategy, Component, effect, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  showScrollButton = signal(false);
  // Forms
  chatForm!: FormGroup;

  constructor(
    public chatService: ChatService,
    private fb: FormBuilder
  ) {
    effect(() => {
      const msgs = chatService.messages();
      setTimeout(() => {
        this.scrollToBottom();
      }, 50)
    })
  }

  // On Init
  ngOnInit() {
    this.chatService.init();
    this._createChatForm();
  }

  ngOnDestroy() {
    this.chatService.destroy();
  }

  // #region Public Methods

  // Get selected user
  selectUser(user: any) {
    this.chatService.selectUser(user);
  }
  // #endregion


  private _createChatForm() {
    this.chatForm = this.fb.group({
      message: new FormControl(null, Validators.required),
    });
  }

  public scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  public sendMessage() {
    const message = this.chatForm.value.message?.trim();

    if (message) {
      this.chatService.sendMessage(message);
      this.chatForm.reset();
    }
  }

  public onScroll() {
    const el = this.scrollContainer.nativeElement;
    if (!el) return;
    const threshold = 50; // small buffer
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + threshold;
    console.log(atBottom);
    
    this.showScrollButton.set(!atBottom);
  }
}
