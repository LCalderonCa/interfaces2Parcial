import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }     from "./context/AuthContext";
import { ReservasProvider } from "./context/ReservasContext";
import { useReservas }      from "./context/ReservasContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import HomePage      from "./pages/public/HomePage";
import LoginPage     from "./pages/public/LoginPage";
import RegisterPage  from "./pages/public/RegisterPage";

// Protected client pages
import ReservarPage    from "./pages/public/ReservarPage";
import MisReservasPage from "./pages/public/MisReservasPage";

// Admin pages
import Dashboard       from "./pages/admin/Dashboard";
import ReservasAdmin   from "./pages/admin/ReservasAdmin";
import MesasAdmin      from "./pages/admin/MesasAdmin";
import CalendarioAdmin from "./pages/admin/CalendarioAdmin";
import ReportesAdmin   from "./pages/admin/ReportesAdmin";

import "./App.css";

// ── Spinner/error — solo dentro de rutas protegidas ───────────
const AppContent = ({ children }) => {
  const { cargando, error } = useReservas();

  if (cargando) return (
    <div className="loading-screen">
      <div className="loading-inner">
        <div className="spinner"></div>
        <p className="loading-text">Conectando con el servidor...</p>
      </div>
    </div>
  );

  if (error) return (
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

  return children;
};

// ── Wrapper: protege + carga datos + muestra spinner ──────────
const ProtectedWithData = ({ children, requiredRole }) => (
  <ReservasProvider>
    <AppContent>
      <ProtectedRoute requiredRole={requiredRole}>
        {children}
      </ProtectedRoute>
    </AppContent>
  </ReservasProvider>
);

// ── App ───────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Rutas públicas (sin carga de API) ── */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* ── Rutas cliente (API carga solo después del login) ── */}
          <Route path="/reservar" element={
            <ProtectedWithData><ReservarPage /></ProtectedWithData>
          } />
          <Route path="/mis-reservas" element={
            <ProtectedWithData><MisReservasPage /></ProtectedWithData>
          } />

          {/* ── Rutas admin (API carga solo después del login) ── */}
          <Route path="/admin" element={
            <ProtectedWithData requiredRole="admin"><Dashboard /></ProtectedWithData>
          } />
          <Route path="/admin/reservas" element={
            <ProtectedWithData requiredRole="admin"><ReservasAdmin /></ProtectedWithData>
          } />
          <Route path="/admin/mesas" element={
            <ProtectedWithData requiredRole="admin"><MesasAdmin /></ProtectedWithData>
          } />
          <Route path="/admin/calendario" element={
            <ProtectedWithData requiredRole="admin"><CalendarioAdmin /></ProtectedWithData>
          } />
          <Route path="/admin/reportes" element={
            <ProtectedWithData requiredRole="admin"><ReportesAdmin /></ProtectedWithData>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
