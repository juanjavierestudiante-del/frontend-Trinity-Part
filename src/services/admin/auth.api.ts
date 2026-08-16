// Peticiones de autenticación del admin.

import adminApi from '../axios.admin';

export interface UsuarioAdmin {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface LoginResponse {
  usuario: UsuarioAdmin;
  token: string;
}

// POST /api/auth/login
export const loginAdmin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await adminApi.post('/auth/login', { email, password });
  return data;
};

// GET /api/auth/perfil
export const getPerfil = async (): Promise<UsuarioAdmin> => {
  const { data } = await adminApi.get('/auth/perfil');
  return data.usuario;
};


