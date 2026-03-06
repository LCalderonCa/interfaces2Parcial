import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        if (result.user.role === "admin") navigate("/admin");
        else navigate("/reservar");
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-pattern"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-brand">
              <span>🍽</span> ReservaPlus
            </Link>
            <h2>Iniciar Sesión</h2>
            <p>Accede para gestionar tus reservas</p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Recordar sesión</label>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
            <Link to="/" className="back-link">← Volver al inicio</Link>
          </div>

          <div className="demo-credentials">
            <p><strong>Demo Admin:</strong> admin@reservaplus.com / admin123</p>
            <p><strong>Demo Cliente:</strong> carlos@mail.com / cliente123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
