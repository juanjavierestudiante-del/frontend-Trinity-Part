// Sincronización de sesión entre el auth público (React Context) y el auth admin (Zustand).
// Son las dos caras de la misma sesión: persistimos en BOTH storages para que no importe
// por qué login entró el usuario ni desde dónde cierra sesión.

export const PUBLIC_USER_KEY = "party-store-current-user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USER_KEY = "admin_usuario";

// Forma del `usuario` que devuelve el backend en /auth/login y /auth/register (snake_case).
export interface AuthUsuarioInput {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

// Forma normalizada que guardamos en el storage público (camelCase, usada por Navbar/carrito).
export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

// Público -> Admin: persiste el storage admin si el usuario es ADMIN.
// Espejo (sentido inverso) de syncPublicAuth.
export function syncAdminAuth(usuario: AuthUsuarioInput, token: string) {
  if (usuario.rol !== "ADMIN") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify({
      idUsuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    })
  );
}

export function clearAdminAuth() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

// Admin -> Público: normaliza y persiste la sesión en el storage público.
// Espejo (sentido inverso) de syncAdminAuth.
export function syncPublicAuth(usuario: AuthUsuarioInput, token: string): PublicUser {
  const normalized: PublicUser = {
    id: usuario.id_usuario,
    name: usuario.nombre,
    email: usuario.email,
    role: usuario.rol,
    token,
  };
  localStorage.setItem(PUBLIC_USER_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearPublicAuth() {
  localStorage.removeItem(PUBLIC_USER_KEY);
}

export function loadPublicUser(): PublicUser | null {
  const raw = localStorage.getItem(PUBLIC_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
