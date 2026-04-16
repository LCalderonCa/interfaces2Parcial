import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Al iniciar, restaurar sesión desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("rp_session");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  // ── Login: llama a la API de Laravel ──────────────────────
  const login = async (email, password) => {
    try {
      const data = await api.clientes.login(email, password);
      // data = { success: true, user: { id, name, email, role } }
      setUser(data.user);
      localStorage.setItem("rp_session", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message || "Credenciales incorrectas" };
    }
  };

  // ── Register: crea cliente en Laravel ─────────────────────
  const register = async (name, email, password) => {
    try {
      const newUser = await api.clientes.registrar(name, email, password);
      setUser(newUser);
      localStorage.setItem("rp_session", JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, message: err.message || "Error al registrar" };
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("rp_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
