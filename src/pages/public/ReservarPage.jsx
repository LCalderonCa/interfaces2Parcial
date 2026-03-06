import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useReservas } from "../../context/ReservasContext";

const HORARIOS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

const ReservarPage = () => {
  const { user } = useAuth();
  const { getMesasDisponibles, crearReserva } = useReservas();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fecha: today,
    hora: "",
    personas: 2,
    mesaId: null,
    notas: "",
  });
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (form.fecha && form.hora && form.personas) {
      const disponibles = getMesasDisponibles(form.fecha, form.hora, form.personas);
      setMesasDisponibles(disponibles);
    }
  }, [form.fecha, form.hora, form.personas]);

  const handleChange = (field) => (e) => {
    const val = field === "personas" ? parseInt(e.target.value) : e.target.value;
    setForm({ ...form, [field]: val, ...(field !== "notas" && field !== "mesaId" ? { mesaId: null } : {}) });
    setError("");
  };

  const handleStep1 = () => {
    if (!form.fecha || !form.hora || !form.personas) { setError("Completa todos los campos"); return; }
    if (mesasDisponibles.length === 0) { setError("No hay mesas disponibles para esa fecha, hora y número de personas."); return; }
    setStep(2);
  };

  const handleStep2 = () => {
    if (!form.mesaId) { setError("Selecciona una mesa"); return; }
    setStep(3);
  };

  const handleConfirmar = () => {
    const result = crearReserva({
      clienteNombre: user.name,
      clienteEmail: user.email,
      mesaId: form.mesaId,
      fecha: form.fecha,
      hora: form.hora,
      personas: form.personas,
      notas: form.notas,
    });
    if (result.success) setResultado(result.reserva);
    else setError(result.message);
  };

  const mesaSeleccionada = mesasDisponibles.find((m) => m.id === form.mesaId);

  if (resultado) {
    return (
      <div className="public-layout">
        <Navbar />
        <main className="reservar-page">
          <div className="reserva-success">
            <div className="success-icon">🎉</div>
            <h2>¡Reserva Realizada!</h2>
            <p>Tu reserva ha sido registrada exitosamente.</p>
            <div className="reserva-summary">
              <div className="summary-row"><span>📅 Fecha:</span><strong>{resultado.fecha}</strong></div>
              <div className="summary-row"><span>🕐 Hora:</span><strong>{resultado.hora}</strong></div>
              <div className="summary-row"><span>👥 Personas:</span><strong>{resultado.personas}</strong></div>
              <div className="summary-row"><span>🪑 Mesa:</span><strong>Mesa #{resultado.mesaId}</strong></div>
              <div className="summary-row"><span>📋 Estado:</span><strong className="estado-badge pendiente">{resultado.estado}</strong></div>
            </div>
            <div className="success-actions">
              <button onClick={() => navigate("/mis-reservas")} className="btn-primary">Ver Mis Reservas</button>
              <button onClick={() => { setResultado(null); setStep(1); setForm({ fecha: today, hora: "", personas: 2, mesaId: null, notas: "" }); }} className="btn-outline">Nueva Reserva</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-layout">
      <Navbar />
      <main className="reservar-page">
        <div className="reservar-container">
          <div className="reservar-header">
            <h1>Reservar Mesa</h1>
            <p>Hola <strong>{user?.name}</strong>, completa el formulario para reservar tu mesa</p>
          </div>

          {/* Steps indicator */}
          <div className="steps-indicator">
            {["Fecha y Hora", "Elegir Mesa", "Confirmar"].map((label, i) => (
              <div key={label} className={`step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {error && <div className="form-alert error">⚠️ {error}</div>}

          {/* Step 1: Fecha y Hora */}
          {step === 1 && (
            <div className="step-content">
              <h3>¿Cuándo quieres venir?</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>📅 Fecha</label>
                  <input type="date" value={form.fecha} min={today} onChange={handleChange("fecha")} />
                </div>
                <div className="form-group">
                  <label>🕐 Hora</label>
                  <select value={form.hora} onChange={handleChange("hora")}>
                    <option value="">Seleccionar horario...</option>
                    {HORARIOS.map((h) => (<option key={h} value={h}>{h}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label>👥 Número de Personas</label>
                  <select value={form.personas} onChange={handleChange("personas")}>
                    {[1,2,3,4,5,6,7,8].map((n) => (<option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>))}
                  </select>
                </div>
              </div>

              {form.fecha && form.hora && (
                <div className="disponibilidad-info">
                  {mesasDisponibles.length > 0 ? (
                    <span className="disponible">✅ {mesasDisponibles.length} mesa(s) disponibles para ese horario</span>
                  ) : (
                    <span className="no-disponible">❌ Sin mesas disponibles para ese horario</span>
                  )}
                </div>
              )}

              <button onClick={handleStep1} className="btn-primary btn-block">Siguiente →</button>
            </div>
          )}

          {/* Step 2: Seleccionar Mesa */}
          {step === 2 && (
            <div className="step-content">
              <h3>Elige tu mesa</h3>
              <p className="step-desc">{form.fecha} | {form.hora} | {form.personas} personas</p>
              <div className="mesas-grid">
                {mesasDisponibles.map((mesa) => (
                  <div
                    key={mesa.id}
                    className={`mesa-option ${form.mesaId === mesa.id ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, mesaId: mesa.id })}
                  >
                    <div className="mesa-icon">🪑</div>
                    <div className="mesa-info">
                      <strong>Mesa {mesa.numero}</strong>
                      <span>Zona: {mesa.zona}</span>
                      <span>Capacidad: {mesa.capacidad} personas</span>
                    </div>
                    {form.mesaId === mesa.id && <span className="mesa-check">✓</span>}
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <button onClick={() => setStep(1)} className="btn-outline">← Atrás</button>
                <button onClick={handleStep2} className="btn-primary">Siguiente →</button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmar */}
          {step === 3 && (
            <div className="step-content">
              <h3>Confirmar Reserva</h3>
              <div className="confirm-summary">
                <div className="summary-row"><span>👤 Cliente:</span><strong>{user?.name}</strong></div>
                <div className="summary-row"><span>📅 Fecha:</span><strong>{form.fecha}</strong></div>
                <div className="summary-row"><span>🕐 Hora:</span><strong>{form.hora}</strong></div>
                <div className="summary-row"><span>👥 Personas:</span><strong>{form.personas}</strong></div>
                <div className="summary-row"><span>🪑 Mesa:</span><strong>Mesa {mesaSeleccionada?.numero} - {mesaSeleccionada?.zona}</strong></div>
              </div>
              <div className="form-group">
                <label>📝 Notas especiales (opcional)</label>
                <textarea value={form.notas} onChange={handleChange("notas")} placeholder="Ej: Cumpleaños, alergias, silla para niño..." rows={3}></textarea>
              </div>
              <div className="step-actions">
                <button onClick={() => setStep(2)} className="btn-outline">← Atrás</button>
                <button onClick={handleConfirmar} className="btn-primary">✅ Confirmar Reserva</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReservarPage;
