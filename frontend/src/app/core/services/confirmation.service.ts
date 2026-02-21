import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

constructor(private modalService: NgbModal) {}

  confirm(options: ConfirmOptions = {}): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true });

    modalRef.componentInstance.title = options.title ?? 'Confirmation';
    modalRef.componentInstance.message = options.message ?? 'Are you sure?';
    modalRef.componentInstance.confirmText = options.confirmText ?? 'Yes';
    modalRef.componentInstance.cancelText = options.cancelText ?? 'No';

    return modalRef.result.then(
      (result) => result === 'confirm',
      () => false
    );
  }
}
