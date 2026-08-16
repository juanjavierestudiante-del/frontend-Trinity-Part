/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);
const CURRENT_USER_KEY = "party-store-current-user";

function loadCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadCurrentUser());

  const login = async (email, password) => {
    const account = await api.loginUsuario(email, password);
    if (!account) return false;
    const normalized = {
      id: account.id_usuario || account.id,
      name: account.nombre || account.name,
      email: account.correo || account.email,
      role: account.rol,
    };
    setUser(normalized);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
    return true;
  };

  const register = async ({ name, email, password }) => {
    try {
      console.log('AuthContext.register payload', { name, email });
      const creado = await api.crearUsuario({ name, email, password });
      console.log('AuthContext.register creado', creado);
      const normalized = {
        id: creado.id_usuario || creado.id,
        name: creado.nombre || creado.name,
        email: creado.correo || creado.email,
      };
      setUser(normalized);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
      return { ok: true };
    } catch (err) {
      console.error('AuthContext.register error', err);
      // Propagar mensajes de validación del backend cuando existan
      const resp = err?.response?.data;
      if (resp) {
        // express-validator -> { errores: [ { msg } ] }
        if (Array.isArray(resp.errores) && resp.errores.length > 0) {
          return { error: resp.errores[0].msg };
        }
        // backend custom -> { error: '...' }
        if (resp.error) return { error: resp.error };
      }
      return { error: err.message || 'Error al crear usuario' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
