/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { loginPublico, registrarUsuario } from "../services/public/auth.api";
import {
  syncAdminAuth,
  clearAdminAuth,
  syncPublicAuth,
  clearPublicAuth,
  loadPublicUser,
} from "../services/auth.sync";

// Tipado como `any` para que los consumidores .tsx (p. ej. el panel admin) puedan
// usar useAuth() sin luchar contra la inferencia de un contexto no tipado.
/** @type {import("react").Context<any>} */
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadPublicUser());

  const login = async (email, password) => {
    try {
      const { usuario, token } = await loginPublico(email, password);
      const normalized = syncPublicAuth(usuario, token);
      setUser(normalized);
      syncAdminAuth(usuario, token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const { usuario, token } = await registrarUsuario({
        nombre: name,
        email,
        password,
      });
      const normalized = syncPublicAuth(usuario, token);
      setUser(normalized);
      syncAdminAuth(usuario, token);
      return { ok: true };
    } catch (err) {
      const resp = err?.response?.data;
      if (resp) {
        if (Array.isArray(resp.errores) && resp.errores.length > 0) {
          return { error: resp.errores[0].msg };
        }
        if (resp.error) return { error: resp.error };
      }
      return { error: err.message || "Error al crear usuario" };
    }
  };

  const logout = () => {
    setUser(null);
    clearPublicAuth();
    clearAdminAuth();
  };

  // Admin -> Público: hace visible la sesión en la tienda (Navbar/carrito) al loguearse
  // desde el panel de administración, sin volver a llamar a la API.
  const applyPublicSession = (usuario, token) => {
    const normalized = syncPublicAuth(usuario, token);
    setUser(normalized);
    return normalized;
  };

  // Admin -> Público: cierra sesión pública cuando se cierra desde el panel.
  const clearPublicSession = () => {
    setUser(null);
    clearPublicAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, applyPublicSession, clearPublicSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
