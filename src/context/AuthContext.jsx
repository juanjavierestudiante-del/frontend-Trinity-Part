/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { loginPublico, registrarUsuario } from "../services/public/auth.api";

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

function syncAdminAuth(usuario, token) {
  if (usuario.rol === "ADMIN") {
    localStorage.setItem("admin_token", token);
    localStorage.setItem(
      "admin_usuario",
      JSON.stringify({
        idUsuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      })
    );
  }
}

function clearAdminAuth() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_usuario");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadCurrentUser());

  const login = async (email, password) => {
    try {
      const { usuario, token } = await loginPublico(email, password);
      const normalized = {
        id: usuario.id_usuario,
        name: usuario.nombre,
        email: usuario.email,
        role: usuario.rol,
        token,
      };
      setUser(normalized);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
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
      const normalized = {
        id: usuario.id_usuario,
        name: usuario.nombre,
        email: usuario.email,
        role: usuario.rol,
        token,
      };
      setUser(normalized);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
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
    localStorage.removeItem(CURRENT_USER_KEY);
    clearAdminAuth();
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
