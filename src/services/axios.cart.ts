import axios from 'axios';

const cartApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

cartApi.interceptors.request.use((config) => {
  const raw = localStorage.getItem('party-store-current-user');
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

export default cartApi;
