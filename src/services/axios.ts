// Instancia base de Axios para la tienda pública.
// Todos los servicios de la tienda importan ESTA instancia,
// no axios directo — así si cambia la URL base, solo lo cambiás acá.

import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSessionProbe = error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isSessionProbe) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

export default publicApi;
