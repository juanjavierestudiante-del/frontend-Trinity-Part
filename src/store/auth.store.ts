import { create } from 'zustand';
import { actualizarPerfil, cerrarSesion, completarPerfil, loginGoogle, loginPublico, obtenerSesionActual, registrarUsuario } from '../services/public/auth.api';
import { loginAdmin, type UsuarioAdmin } from '../services/admin/auth.api';

export interface AuthUser {
  id_usuario: number;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  avatarUrl: string | null;
  rol: string;
  estado: string;
  emailVerificado: boolean;
  telefonoVerificado: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginAdmin: (email: string, password: string) => Promise<AuthUser>;
  register: (input: { nombre: string; apellido: string; email: string; telefono: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  googleLogin: (credential: string) => Promise<AuthUser>;
  completeProfile: (telefono: string) => Promise<AuthUser>;
  updateProfile: (input: { nombre: string; apellido: string | null; telefono: string }) => Promise<AuthUser>;
}

let initializePromise: Promise<void> | null = null;

const clearLegacyAuthStorage = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_usuario');
  localStorage.removeItem('party-store-current-user');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearSession: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  initialize: () => {
    if (initializePromise) return initializePromise;
    initializePromise = (async () => {
      clearLegacyAuthStorage();
      try {
        const { usuario } = await obtenerSesionActual();
        set({ user: usuario, isAuthenticated: true, isLoading: false });
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    })();
    return initializePromise;
  },
  login: async (email, password) => {
    const { usuario } = await loginPublico(email, password);
    set({ user: usuario, isAuthenticated: true, isLoading: false });
    return usuario;
  },
  loginAdmin: async (email, password) => {
    const { usuario } = await loginAdmin(email, password);
    set({ user: usuario as UsuarioAdmin, isAuthenticated: true, isLoading: false });
    return usuario;
  },
  register: async (input) => {
    const { usuario } = await registrarUsuario(input);
    set({ user: usuario, isAuthenticated: true, isLoading: false });
    return usuario;
  },
  logout: async () => {
    try {
      await cerrarSesion();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  googleLogin: async (credential) => { const { usuario } = await loginGoogle(credential); set({ user: usuario, isAuthenticated: true, isLoading: false }); return usuario; },
  completeProfile: async (telefono) => { const { usuario } = await completarPerfil(telefono); set({ user: usuario, isAuthenticated: true, isLoading: false }); return usuario; },
  updateProfile: async (input) => { const { usuario } = await actualizarPerfil(input); set({ user: usuario, isAuthenticated: true, isLoading: false }); return usuario; },
}));
