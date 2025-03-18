import type {
  ToastActionElement,
  ToastProps,
} from '@/components/ui/toast';
import type { ReactNode } from 'react';

export type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
};

export type Toast = Omit<ToasterToast, 'id'>;

export type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: ToasterToast['id'] }
  | { type: 'REMOVE_TOAST'; toastId?: ToasterToast['id'] };

export interface ToastState {
  toasts: ToasterToast[];
}
