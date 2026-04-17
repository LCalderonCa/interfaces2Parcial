import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useReservas } from "../../context/ReservasContext";

const MisReservasPage = () => {
  const { user } = useAuth();
  const { reservas, mesas, actualizarEstadoReserva } = useReservas();
  const navigate = useNavigate();

  const misReservas = reservas.filter((r) => r.clienteEmail === user?.email);

  const getMesa = (id) => mesas.find((m) => m.id === id);

  const estadoClass = (estado) => {
    if (estado === "confirmada") return "badge-success";
    if (estado === "pendiente")  return "badge-warning";
    if (estado === "cancelada")  return "badge-danger";
    return "badge-default";
  };

  // Devuelve true si la reserva es para mañana o días posteriores
  const puedeCancelar = (fechaReserva) => {
    const hoy    = new Date();
    hoy.setHours(0, 0, 0, 0);                          // inicio del día de hoy
    const reserva = new Date(fechaReserva + "T00:00:00"); // evitar problema de zona horaria
    const diffMs   = reserva - hoy;
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias >= 1;                               // 1 día o más de diferencia
  };

  return (
    <div className="public-layout">
      <Navbar />
      <main className="mis-reservas-page">
        <div className="page-container">
          <div className="page-header">
            <h1>Mis Reservas</h1>
            <p>Hola <strong>{user?.name}</strong>, aquí están tus reservas registradas.</p>
            <button onClick={() => navigate("/reservar")} className="btn-primary">
              + Nueva Reserva
            </button>
          </div>

          {misReservas.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No tienes reservas aún</h3>
              <p>Haz tu primera reserva y disfruta de nuestra experiencia</p>
              <button onClick={() => navigate("/reservar")} className="btn-primary">Reservar Mesa</button>
            </div>
          ) : (
            <div className="reservas-list">
              {misReservas.map((r) => {
                const mesa         = getMesa(r.mesaId);
                const cancelable   = r.estado !== "cancelada" && puedeCancelar(r.fecha);
                const hoy          = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();
                const fechaReserva = new Date(r.fecha + "T00:00:00");
                const esHoy        = fechaReserva.getTime() === hoy.getTime();
                const esPasada     = fechaReserva < hoy;

                return (
                  <div key={r.id} className={`reserva-card ${r.estado}`}>
                    <div className="reserva-card-header">
                      <div className="reserva-id">Reserva #{r.id}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {esHoy    && r.estado !== "cancelada" && <span className="reserva-tag hoy">Hoy</span>}
                        {esPasada && r.estado !== "cancelada" && <span className="reserva-tag pasada">Finalizada</span>}
                        <span className={`estado-badge ${estadoClass(r.estado)}`}>{r.estado}</span>
                      </div>
                    </div>

                    <div className="reserva-card-body">
                      <div className="reserva-detail"><span>📅</span><div><strong>Fecha</strong><p>{r.fecha}</p></div></div>
                      <div className="reserva-detail"><span>🕐</span><div><strong>Hora</strong><p>{r.hora}</p></div></div>
                      <div className="reserva-detail"><span>👥</span><div><strong>Personas</strong><p>{r.personas}</p></div></div>
                      <div className="reserva-detail"><span>🪑</span><div><strong>Mesa</strong><p>{mesa ? `Mesa ${mesa.numero} - ${mesa.zona}` : "N/A"}</p></div></div>
                      {r.notas && <div className="reserva-detail"><span>📝</span><div><strong>Notas</strong><p>{r.notas}</p></div></div>}
                    </div>

                    {/* Botón cancelar: solo si no está cancelada Y falta 1 día o más */}
                    {cancelable && (
                      <div className="reserva-card-footer">
                        <button
                          onClick={() => actualizarEstadoReserva(r.id, "cancelada")}
                          className="btn-danger-sm"
                        >
                          Cancelar Reserva
                        </button>
                      </div>
                    )}

                    {/* Mensaje informativo si no se puede cancelar */}
                    {r.estado !== "cancelada" && !cancelable && (
                      <div className="reserva-card-footer">
                        <span className="no-cancelable-msg">
                          {esPasada ? "⏰ Reserva ya realizada" : "⚠️ No se puede cancelar con menos de 24 horas"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MisReservasPage;
