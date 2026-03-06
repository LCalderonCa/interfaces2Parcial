import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";

const ZONAS = ["Interior", "Terraza", "Barra", "Salón VIP", "Jardín"];

const MesasAdmin = () => {
  const { mesas, actualizarMesa, agregarMesa, eliminarMesa } = useReservas();
  const [showForm, setShowForm] = useState(false);
  const [editingMesa, setEditingMesa] = useState(null);
  const [form, setForm] = useState({ numero: "", capacidad: 2, zona: "Interior" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSubmit = () => {
    if (!form.numero) return;
    if (editingMesa) {
      actualizarMesa(editingMesa.id, { numero: parseInt(form.numero), capacidad: parseInt(form.capacidad), zona: form.zona });
    } else {
      agregarMesa({ numero: parseInt(form.numero), capacidad: parseInt(form.capacidad), zona: form.zona });
    }
    setShowForm(false);
    setEditingMesa(null);
    setForm({ numero: "", capacidad: 2, zona: "Interior" });
  };

  const handleEdit = (mesa) => {
    setEditingMesa(mesa);
    setForm({ numero: mesa.numero, capacidad: mesa.capacidad, zona: mesa.zona });
    setShowForm(true);
  };

  const handleEstado = (id, estado) => {
    actualizarMesa(id, { estado });
  };

  const estadoColor = (estado) => {
    if (estado === "disponible") return "badge-success";
    if (estado === "ocupada") return "badge-danger";
    if (estado === "reservada") return "badge-warning";
    if (estado === "mantenimiento") return "badge-default";
    return "";
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Gestionar Mesas</h1>
          <nav className="breadcrumb">
            <span>Dashboard</span> / <span className="active">Mesas</span>
          </nav>
          <button onClick={() => { setShowForm(true); setEditingMesa(null); setForm({ numero: "", capacidad: 2, zona: "Interior" }); }} className="btn-primary">
            + Agregar Mesa
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingMesa ? "✏️ Editar Mesa" : "➕ Nueva Mesa"}</h3>
              <div className="form-group">
                <label>Número de Mesa</label>
                <input type="number" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} placeholder="Ej: 10" />
              </div>
              <div className="form-group">
                <label>Capacidad (personas)</label>
                <select value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })}>
                  {[1,2,3,4,5,6,7,8,10,12].map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
              <div className="form-group">
                <label>Zona</label>
                <select value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })}>
                  {ZONAS.map((z) => (<option key={z} value={z}>{z}</option>))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn-primary">{editingMesa ? "Guardar" : "Crear Mesa"}</button>
                <button onClick={() => { setShowForm(false); setEditingMesa(null); }} className="btn-outline">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm delete modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>⚠️ Confirmar eliminación</h3>
              <p>¿Eliminar la Mesa #{confirmDelete}?</p>
              <div className="modal-actions">
                <button onClick={() => { eliminarMesa(confirmDelete); setConfirmDelete(null); }} className="btn-danger">Eliminar</button>
                <button onClick={() => setConfirmDelete(null)} className="btn-outline">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Vista en cards */}
        <div className="mesas-admin-grid">
          {mesas.map((mesa) => (
            <div key={mesa.id} className={`mesa-admin-card ${mesa.estado}`}>
              <div className="mesa-admin-header">
                <span className="mesa-num">Mesa {mesa.numero}</span>
                <span className={`estado-badge ${estadoColor(mesa.estado)}`}>{mesa.estado}</span>
              </div>
              <div className="mesa-admin-body">
                <div className="mesa-stat"><span>🏠</span> {mesa.zona}</div>
                <div className="mesa-stat"><span>👥</span> {mesa.capacidad} personas</div>
              </div>
              <div className="mesa-admin-actions">
                <select
                  value={mesa.estado}
                  onChange={(e) => handleEstado(mesa.id, e.target.value)}
                  className="estado-select"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="reservada">Reservada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
                <button onClick={() => handleEdit(mesa)} className="btn-action-sm edit">✏️</button>
                <button onClick={() => setConfirmDelete(mesa.id)} className="btn-action-sm delete">🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* Also show table view */}
        <div className="table-wrapper mt-4">
          <h3>Vista de Tabla</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mesa #</th>
                <th>Zona</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => (
                <tr key={mesa.id}>
                  <td><strong>Mesa {mesa.numero}</strong></td>
                  <td>{mesa.zona}</td>
                  <td>{mesa.capacidad} personas</td>
                  <td><span className={`estado-badge ${estadoColor(mesa.estado)}`}>{mesa.estado}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(mesa)} className="btn-action warning">✏️</button>
                      <button onClick={() => setConfirmDelete(mesa.id)} className="btn-action danger">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MesasAdmin;
