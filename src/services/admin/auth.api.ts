// Peticiones de autenticación del admin.

import adminApi from '../axios.admin';

export interface UsuarioAdmin {
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

export interface LoginResponse {
  usuario: UsuarioAdmin;
}

// POST /api/auth/login
export const loginAdmin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await adminApi.post('/auth/admin/login', { email, password });
  return data;
};

// GET /api/auth/perfil
export const getPerfil = async (): Promise<UsuarioAdmin> => {
  const { data } = await adminApi.get('/auth/me');
  return data.usuario;
};
