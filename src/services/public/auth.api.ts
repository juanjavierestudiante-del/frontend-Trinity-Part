import publicApi from '../axios';

export interface UsuarioPublico {
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

export interface AuthResponse {
  usuario: UsuarioPublico;
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
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await publicApi.post('/auth/register', body);
  return data;
};

export const obtenerSesionActual = async (): Promise<AuthResponse> => {
  const { data } = await publicApi.get('/auth/me');
  return data;
};

export const cerrarSesion = async () => {
  await publicApi.post('/auth/logout');
};
