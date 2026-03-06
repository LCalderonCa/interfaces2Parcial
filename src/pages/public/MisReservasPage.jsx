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
    if (estado === "pendiente") return "badge-warning";
    if (estado === "cancelada") return "badge-danger";
    return "badge-default";
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
                const mesa = getMesa(r.mesaId);
                return (
                  <div key={r.id} className={`reserva-card ${r.estado}`}>
                    <div className="reserva-card-header">
                      <div className="reserva-id">Reserva #{r.id}</div>
                      <span className={`estado-badge ${estadoClass(r.estado)}`}>{r.estado}</span>
                    </div>
                    <div className="reserva-card-body">
                      <div className="reserva-detail"><span>📅</span><div><strong>Fecha</strong><p>{r.fecha}</p></div></div>
                      <div className="reserva-detail"><span>🕐</span><div><strong>Hora</strong><p>{r.hora}</p></div></div>
                      <div className="reserva-detail"><span>👥</span><div><strong>Personas</strong><p>{r.personas}</p></div></div>
                      <div className="reserva-detail"><span>🪑</span><div><strong>Mesa</strong><p>{mesa ? `Mesa ${mesa.numero} - ${mesa.zona}` : "N/A"}</p></div></div>
                      {r.notas && <div className="reserva-detail"><span>📝</span><div><strong>Notas</strong><p>{r.notas}</p></div></div>}
                    </div>
                    {r.estado !== "cancelada" && (
                      <div className="reserva-card-footer">
                        <button
                          onClick={() => actualizarEstadoReserva(r.id, "cancelada")}
                          className="btn-danger-sm"
                        >
                          Cancelar Reserva
                        </button>
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
