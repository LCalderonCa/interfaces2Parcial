import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    // register ahora es async → necesita await
    const result = await register(form.name, form.email, form.password);

    setLoading(false);

    if (result.success) {
      navigate("/reservar");
    } else {
      setApiError(result.message);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-bg-pattern"></div></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-brand"><span>🍽</span> ReservaPlus</Link>
            <h2>Crear Cuenta</h2>
            <p>Regístrate para reservar mesas fácilmente</p>
          </div>

          {apiError && <div className="auth-error">⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Carlos Torres Rojas" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" value={form.email} onChange={handleChange("email")} placeholder="correo@ejemplo.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={handleChange("password")} placeholder="••••••••" />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input type="password" value={form.confirm} onChange={handleChange("confirm")} placeholder="••••••••" />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : "Crear Cuenta"}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
            <Link to="/" className="back-link">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
