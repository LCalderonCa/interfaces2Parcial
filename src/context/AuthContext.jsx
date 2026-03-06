import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../data/db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("rp_session");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const usuarios = db.usuarios.getAll();
    const found = usuarios.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: "Credenciales incorrectas" };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("rp_session", JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const register = (name, email, password) => {
    const usuarios = db.usuarios.getAll();
    if (usuarios.find(u => u.email === email))
      return { success: false, message: "El email ya está registrado" };
    const newUser = { id: Date.now(), name, email, password, role: "cliente" };
    db.usuarios.save([...usuarios, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("rp_session", JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

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
