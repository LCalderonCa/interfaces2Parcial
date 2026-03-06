import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";

const ReportesAdmin = () => {
  const { reservas, mesas } = useReservas();

  const stats = useMemo(() => {
    const total = reservas.length;
    const confirmadas = reservas.filter(r => r.estado === "confirmada").length;
    const pendientes = reservas.filter(r => r.estado === "pendiente").length;
    const canceladas = reservas.filter(r => r.estado === "cancelada").length;

    // Reservas por día
    const byDia = {};
    reservas.forEach(r => {
      if (!byDia[r.fecha]) byDia[r.fecha] = 0;
      byDia[r.fecha]++;
    });
    const topDias = Object.entries(byDia).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Reservas por hora
    const byHora = {};
    reservas.forEach(r => {
      if (!byHora[r.hora]) byHora[r.hora] = 0;
      byHora[r.hora]++;
    });
    const topHoras = Object.entries(byHora).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Mesas más reservadas
    const byMesa = {};
    reservas.forEach(r => {
      if (!byMesa[r.mesaId]) byMesa[r.mesaId] = 0;
      byMesa[r.mesaId]++;
    });
    const topMesas = Object.entries(byMesa).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Total personas
    const totalPersonas = reservas.filter(r => r.estado !== "cancelada").reduce((sum, r) => sum + r.personas, 0);

    return { total, confirmadas, pendientes, canceladas, topDias, topHoras, topMesas, totalPersonas };
  }, [reservas]);

  const getMesaLabel = (id) => {
    const mesa = mesas.find(m => m.id === parseInt(id));
    return mesa ? `Mesa ${mesa.numero} (${mesa.zona})` : `Mesa #${id}`;
  };

  const pct = (val) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Reportes y Estadísticas</h1>
          <nav className="breadcrumb">
            <span>Dashboard</span> / <span className="active">Reportes</span>
          </nav>
        </div>

        {/* Summary */}
        <div className="stats-grid">
          <div className="stat-card orange">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Reservas</span>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{pct(stats.confirmadas)}%</span>
              <span className="stat-label">Tasa de Confirmación</span>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <span className="stat-value">{pct(stats.canceladas)}%</span>
              <span className="stat-label">Tasa de Cancelación</span>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalPersonas}</span>
              <span className="stat-label">Total Comensales</span>
            </div>
          </div>
        </div>

        {/* Estado distribution */}
        <div className="report-section">
          <h3>📊 Distribución por Estado</h3>
          <div className="distribution-bars">
            <div className="dist-item">
              <div className="dist-label">
                <span>Confirmadas</span>
                <span>{stats.confirmadas} ({pct(stats.confirmadas)}%)</span>
              </div>
              <div className="dist-bar">
                <div className="dist-fill green" style={{ width: `${pct(stats.confirmadas)}%` }}></div>
              </div>
            </div>
            <div className="dist-item">
              <div className="dist-label">
                <span>Pendientes</span>
                <span>{stats.pendientes} ({pct(stats.pendientes)}%)</span>
              </div>
              <div className="dist-bar">
                <div className="dist-fill yellow" style={{ width: `${pct(stats.pendientes)}%` }}></div>
              </div>
            </div>
            <div className="dist-item">
              <div className="dist-label">
                <span>Canceladas</span>
                <span>{stats.canceladas} ({pct(stats.canceladas)}%)</span>
              </div>
              <div className="dist-bar">
                <div className="dist-fill red" style={{ width: `${pct(stats.canceladas)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="reports-grid">
          {/* Top días */}
          <div className="report-card">
            <h4>📅 Días con más reservas</h4>
            <table className="report-table">
              <thead><tr><th>Fecha</th><th>Reservas</th></tr></thead>
              <tbody>
                {stats.topDias.length === 0 ? (
                  <tr><td colSpan={2} className="empty-row">Sin datos</td></tr>
                ) : stats.topDias.map(([fecha, count]) => (
                  <tr key={fecha}><td>{fecha}</td><td><span className="report-badge">{count}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top horas */}
          <div className="report-card">
            <h4>🕐 Horarios más demandados</h4>
            <table className="report-table">
              <thead><tr><th>Hora</th><th>Reservas</th></tr></thead>
              <tbody>
                {stats.topHoras.length === 0 ? (
                  <tr><td colSpan={2} className="empty-row">Sin datos</td></tr>
                ) : stats.topHoras.map(([hora, count]) => (
                  <tr key={hora}><td>{hora}</td><td><span className="report-badge">{count}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top mesas */}
          <div className="report-card">
            <h4>🪑 Mesas más reservadas</h4>
            <table className="report-table">
              <thead><tr><th>Mesa</th><th>Reservas</th></tr></thead>
              <tbody>
                {stats.topMesas.length === 0 ? (
                  <tr><td colSpan={2} className="empty-row">Sin datos</td></tr>
                ) : stats.topMesas.map(([mesaId, count]) => (
                  <tr key={mesaId}><td>{getMesaLabel(mesaId)}</td><td><span className="report-badge">{count}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportesAdmin;
