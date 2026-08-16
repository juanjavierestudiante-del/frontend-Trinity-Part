import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Antes de cada petición, agrega el token si existe
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si el backend responde 401, limpia sesión y manda al login
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest =
      error.config?.url?.includes('/auth/login');

    if (
      error.response?.status === 401 &&
      !isLoginRequest
    ) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_usuario');

      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default adminApi;