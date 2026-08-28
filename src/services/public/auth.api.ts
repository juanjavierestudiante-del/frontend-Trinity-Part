import publicApi from '../axios';

export interface UsuarioPublico {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  usuario: UsuarioPublico;
  token: string;
}

export const loginPublico = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await publicApi.post('/auth/login', { email, password });
  return data;
};

export const registrarUsuario = async (body: {
  nombre: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await publicApi.post('/auth/register', body);
  return data;
};
