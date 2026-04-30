import { create } from 'zustand';

export interface Toast {
  id: number;
  message: string;
  variant?: 'default' | 'success' | 'error';
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant?: Toast['variant']) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = 'default') => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
