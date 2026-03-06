import { useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";

const Dashboard = () => {
  const { reservas, mesas } = useReservas();

  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => ({
    total: reservas.length,
    pendientes: reservas.filter((r) => r.estado === "pendiente").length,
    confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
    canceladas: reservas.filter((r) => r.estado === "cancelada").length,
    hoy: reservas.filter((r) => r.fecha === today && r.estado !== "cancelada").length,
    mesas: mesas.length,
  }), [reservas, mesas]);

  const recientes = [...reservas]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const estadoBadge = (estado) => {
    if (estado === "confirmada") return "badge-success";
    if (estado === "pendiente") return "badge-warning";
    if (estado === "cancelada") return "badge-danger";
    return "";
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <nav className="breadcrumb">
            <span>Inicio</span> / <span className="active">Dashboard</span>
          </nav>
        </div>

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card orange">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Reservas</span>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-value">{stats.pendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.confirmadas}</span>
              <span className="stat-label">Confirmadas</span>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">🗓</div>
            <div className="stat-info">
              <span className="stat-value">{stats.hoy}</span>
              <span className="stat-label">Reservas Hoy</span>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🪑</div>
            <div className="stat-info">
              <span className="stat-value">{stats.mesas}</span>
              <span className="stat-label">Mesas Totales</span>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <span className="stat-value">{stats.canceladas}</span>
              <span className="stat-label">Canceladas</span>
            </div>
          </div>
        </div>

        {/* Recent reservations */}
        <div className="dashboard-section">
          <div className="section-head">
            <h3>Reservas Recientes</h3>
            <Link to="/admin/reservas" className="see-all">Ver todas →</Link>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Personas</th>
                  <th>Mesa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      <div className="client-cell">
                        <span className="client-avatar">{r.clienteNombre[0]}</span>
                        <div>
                          <strong>{r.clienteNombre}</strong>
                          <small>{r.clienteEmail}</small>
                        </div>
                      </div>
                    </td>
                    <td>{r.fecha}</td>
                    <td>{r.hora}</td>
                    <td>{r.personas}</td>
                    <td>Mesa #{r.mesaId}</td>
                    <td><span className={`estado-badge ${estadoBadge(r.estado)}`}>{r.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="quick-links">
          <Link to="/admin/mesas" className="quick-link-card">
            <span>🪑</span>
            <strong>Gestionar Mesas</strong>
            <p>Ver y editar mesas</p>
          </Link>
          <Link to="/admin/reservas" className="quick-link-card">
            <span>📋</span>
            <strong>Ver Reservas</strong>
            <p>Gestionar todas las reservas</p>
          </Link>
          <Link to="/admin/calendario" className="quick-link-card">
            <span>🗓</span>
            <strong>Calendario</strong>
            <p>Vista del calendario</p>
          </Link>
          <Link to="/admin/reportes" className="quick-link-card">
            <span>📊</span>
            <strong>Reportes</strong>
            <p>Estadísticas del negocio</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
