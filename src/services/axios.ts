// Instancia base de Axios para la tienda pública.
// Todos los servicios de la tienda importan ESTA instancia,
// no axios directo — así si cambia la URL base, solo lo cambiás acá.

import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default publicApi;