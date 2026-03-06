import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";

const ReservasAdmin = () => {
  const { reservas, mesas, actualizarEstadoReserva, eliminarReserva } = useReservas();
  const [filtro, setFiltro] = useState({ estado: "", fecha: "", buscar: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtradas = useMemo(() => {
    return reservas.filter((r) => {
      if (filtro.estado && r.estado !== filtro.estado) return false;
      if (filtro.fecha && r.fecha !== filtro.fecha) return false;
      if (filtro.buscar && !r.clienteNombre.toLowerCase().includes(filtro.buscar.toLowerCase()) &&
          !r.clienteEmail.toLowerCase().includes(filtro.buscar.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.id - a.id);
  }, [reservas, filtro]);

  const getMesa = (id) => mesas.find((m) => m.id === id);

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
          <h1>Gestión de Reservas</h1>
          <nav className="breadcrumb">
            <span>Dashboard</span> / <span className="active">Reservas</span>
          </nav>
        </div>

        {/* Filtros */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Buscar por cliente o email..."
            value={filtro.buscar}
            onChange={(e) => setFiltro({ ...filtro, buscar: e.target.value })}
            className="filter-input"
          />
          <select value={filtro.estado} onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })} className="filter-select">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <input
            type="date"
            value={filtro.fecha}
            onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
            className="filter-input"
          />
          <button onClick={() => setFiltro({ estado: "", fecha: "", buscar: "" })} className="btn-clear">
            Limpiar
          </button>
        </div>

        <div className="results-count">
          Mostrando <strong>{filtradas.length}</strong> de {reservas.length} reservas
        </div>

        {/* Confirm delete modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>⚠️ Confirmar eliminación</h3>
              <p>¿Estás seguro de eliminar la reserva #{confirmDelete}? Esta acción no se puede deshacer.</p>
              <div className="modal-actions">
                <button onClick={() => { eliminarReserva(confirmDelete); setConfirmDelete(null); }} className="btn-danger">Eliminar</button>
                <button onClick={() => setConfirmDelete(null)} className="btn-outline">Cancelar</button>
              </div>
            </div>
          </div>
        )}

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
                <th>Notas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr><td colSpan={9} className="empty-row">No se encontraron reservas</td></tr>
              ) : (
                filtradas.map((r) => {
                  const mesa = getMesa(r.mesaId);
                  return (
                    <tr key={r.id}>
                      <td><strong>#{r.id}</strong></td>
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
                      <td>{mesa ? `Mesa ${mesa.numero} (${mesa.zona})` : `Mesa #${r.mesaId}`}</td>
                      <td><small>{r.notas || "—"}</small></td>
                      <td><span className={`estado-badge ${estadoBadge(r.estado)}`}>{r.estado}</span></td>
                      <td>
                        <div className="action-buttons">
                          {r.estado === "pendiente" && (
                            <button onClick={() => actualizarEstadoReserva(r.id, "confirmada")} className="btn-action success" title="Confirmar">✓</button>
                          )}
                          {r.estado !== "cancelada" && (
                            <button onClick={() => actualizarEstadoReserva(r.id, "cancelada")} className="btn-action warning" title="Cancelar">✕</button>
                          )}
                          <button onClick={() => setConfirmDelete(r.id)} className="btn-action danger" title="Eliminar">🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReservasAdmin;
