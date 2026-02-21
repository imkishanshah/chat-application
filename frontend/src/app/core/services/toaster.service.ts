import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastConfig, ToastType } from '../models/toaster.model';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  private config: ToastConfig = {
    duration: 4000,
    position: 'top-right',
    maxToasts: 5
  };

  private toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {}

  setConfig(config: Partial<ToastConfig>): void {
    this.config = { ...this.config, ...config };
  }

  show(message: string, type: ToastType = 'info', duration?: number, title?: string): string {
    const id = this.generateId();
    const toast: Toast = {
      id,
      message,
      type,
      duration: duration ?? this.config.duration,
      title
    };

    const currentToasts = this.toastsSubject.value;
    
    // Respect max toasts limit
    if (currentToasts.length >= (this.config.maxToasts || 5)) {
      const oldest = currentToasts[0];
      this.clearTimer(oldest.id);
      currentToasts.shift();
    }

    currentToasts.push(toast);
    this.toastsSubject.next([...currentToasts]);

    // Auto-dismiss if duration > 0
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, toast.duration);
      this.toastTimers.set(id, timer);
    }

    return id;
  }

  success(message: string, title?: string, duration?: number): string {
    return this.show(message, 'success', duration, title);
  }

  error(message: string, title?: string, duration?: number): string {
    return this.show(message, 'error', duration || 6000, title);
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.show(message, 'warning', duration, title);
  }

  info(message: string, title?: string, duration?: number): string {
    return this.show(message, 'info', duration, title);
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    const currentToasts = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(currentToasts);
  }

  dismissAll(): void {
    this.toastTimers.forEach(timer => clearTimeout(timer));
    this.toastTimers.clear();
    this.toastsSubject.next([]);
  }

  private clearTimer(id: string): void {
    const timer = this.toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.toastTimers.delete(id);
    }
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
