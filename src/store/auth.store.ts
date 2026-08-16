// Estado global de autenticación con Zustand.
// Persiste en localStorage para sobrevivir refresco de página.

import { create } from 'zustand';
import type { UsuarioAdmin } from '../services/admin/auth.api';

interface AuthState {
  usuario: UsuarioAdmin | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (usuario: UsuarioAdmin, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: (() => {
    const raw = localStorage.getItem('admin_usuario');
    return raw ? JSON.parse(raw) : null;
  })(),
  token: localStorage.getItem('admin_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),

  setAuth: (usuario, token) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_usuario', JSON.stringify(usuario));
    set({ usuario, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_usuario');
    set({ usuario: null, token: null, isAuthenticated: false });
  },
}));

