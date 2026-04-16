import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReservasProvider } from "./context/ReservasContext";
import { useReservas } from "./context/ReservasContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import HomePage       from "./pages/public/HomePage";
import LoginPage      from "./pages/public/LoginPage";
import RegisterPage   from "./pages/public/RegisterPage";
import ReservarPage   from "./pages/public/ReservarPage";
import MisReservasPage from "./pages/public/MisReservasPage";

// Admin pages
import Dashboard      from "./pages/admin/Dashboard";
import ReservasAdmin  from "./pages/admin/ReservasAdmin";
import MesasAdmin     from "./pages/admin/MesasAdmin";
import CalendarioAdmin from "./pages/admin/CalendarioAdmin";
import ReportesAdmin  from "./pages/admin/ReportesAdmin";

import "./App.css";

// ── Pantalla de carga y error global ──────────────────────────
const AppContent = () => {
  const { cargando, error } = useReservas();

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="spinner"></div>
          <p className="loading-text">Conectando con el servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-inner error-state">
          <span className="error-icon">⚠️</span>
          <h3>Error de conexión</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Protected client routes */}
      <Route path="/reservar"     element={<ProtectedRoute><ReservarPage /></ProtectedRoute>} />
      <Route path="/mis-reservas" element={<ProtectedRoute><MisReservasPage /></ProtectedRoute>} />

      {/* Protected admin routes */}
      <Route path="/admin"            element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/reservas"   element={<ProtectedRoute requiredRole="admin"><ReservasAdmin /></ProtectedRoute>} />
      <Route path="/admin/mesas"      element={<ProtectedRoute requiredRole="admin"><MesasAdmin /></ProtectedRoute>} />
      <Route path="/admin/calendario" element={<ProtectedRoute requiredRole="admin"><CalendarioAdmin /></ProtectedRoute>} />
      <Route path="/admin/reportes"   element={<ProtectedRoute requiredRole="admin"><ReportesAdmin /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ── App principal ─────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservasProvider>
          <AppContent />
        </ReservasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
