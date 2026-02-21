import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster.service';
import { Toast } from '../../../core/models/toaster.model';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toasterService: ToasterService) {}

  ngOnInit(): void {
    this.toasterService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  dismiss(id: string): void {
    this.toasterService.dismiss(id);
  }

  getIconClass(type: string): string {
    const icons: { [key: string]: string } = {
      success: 'bi-check-circle',
      error: 'bi-exclamation-circle',
      warning: 'bi-exclamation-triangle',
      info: 'bi-info-circle'
    };
    return icons[type] || 'bi-info-circle';
  }

  getToastClasses(type: string): string {
    return `toast-${type}`;
  }
}
