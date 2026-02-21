import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirm';
  @Input() message: string = 'Are you sure you want to continue?';
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'No';

  constructor(public activeModal: NgbActiveModal) { }
}
