// Instancia base de Axios para la tienda pública.
// Todos los servicios de la tienda importan ESTA instancia,
// no axios directo — así si cambia la URL base, solo lo cambiás acá.

import axios from 'axios';
import { PUBLIC_USER_KEY } from './auth.sync';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token de la sesión pública (usuario logueado) si existe.
// Permite que el carrito/pedidos del storefront usen la misma instancia.
publicApi.interceptors.request.use((config) => {
  const raw = localStorage.getItem(PUBLIC_USER_KEY);
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // ignorar errores de parseo
    }
  }
  return config;
});

export default publicApi;