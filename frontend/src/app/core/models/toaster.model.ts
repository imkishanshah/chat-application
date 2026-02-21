export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // milliseconds, 0 = manual dismiss
  icon?: string;
  title?: string;
}

export interface ToastConfig {
  duration?: number; // default duration for all toasts
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  maxToasts?: number; // max number of toasts to show at once
}
