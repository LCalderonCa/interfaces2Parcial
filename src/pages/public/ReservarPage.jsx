import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useReservas } from "../../context/ReservasContext";

const HORARIOS = ["12:00","12:30","13:00","13:30","14:00","14:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];

const ZONA_ICON = {
  "Interior":  "🏠",
  "Terraza":   "🌿",
  "Barra":     "🍹",
  "Salón VIP": "⭐",
  "Jardín":    "🌸",
};

const ReservarPage = () => {
  const { user } = useAuth();
  const { getMesasDisponibles, getMesasConEstado, crearReserva } = useReservas();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState({ fecha: today, hora: "", personas: 2, mesaId: null, notas: "" });
  const [mesasConEstado, setMesasConEstado] = useState([]);
  const [resultado, setResultado]   = useState(null);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (form.fecha && form.hora && form.personas) {
      setMesasConEstado(getMesasConEstado(form.fecha, form.hora, form.personas));
    }
  }, [form.fecha, form.hora, form.personas, getMesasConEstado]);

  const mesasDisponibles = mesasConEstado.filter(m => m.disponible);

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
    if (!form.mesaId) { setError("Selecciona una mesa disponible"); return; }
    setStep(3);
  };

  const handleConfirmar = async () => {
    setLoading(true);
    setError("");
    const result = await crearReserva({
      clienteNombre: user.name,
      clienteEmail:  user.email,
      mesaId:   form.mesaId,
      fecha:    form.fecha,
      hora:     form.hora,
      personas: form.personas,
      notas:    form.notas,
    });
    setLoading(false);
    if (result.success) setResultado(result.reserva);
    else setError(result.message);
  };

  // Agrupar todas las mesas por zona para el mapa
  const mesasPorZona = mesasConEstado.reduce((acc, mesa) => {
    if (!acc[mesa.zona]) acc[mesa.zona] = [];
    acc[mesa.zona].push(mesa);
    return acc;
  }, {});

  const mesaSeleccionada = mesasConEstado.find(m => m.id === form.mesaId);

  // ── Pantalla éxito ────────────────────────────────────────
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

          {/* Steps */}
          <div className="steps-indicator">
            {["Fecha y Hora", "Elegir Mesa", "Confirmar"].map((label, i) => (
              <div key={label} className={`step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {error && <div className="form-alert error">⚠️ {error}</div>}

          {/* ── Step 1 ── */}
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
                    {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>👥 Número de Personas</label>
                  <select value={form.personas} onChange={handleChange("personas")}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>)}
                  </select>
                </div>
              </div>

              {form.fecha && form.hora && (
                <div className="disponibilidad-info">
                  {mesasDisponibles.length > 0
                    ? <span className="disponible">✅ {mesasDisponibles.length} mesa(s) disponibles</span>
                    : <span className="no-disponible">❌ Sin mesas disponibles para ese horario</span>
                  }
                </div>
              )}

              <button onClick={handleStep1} className="btn-primary btn-block">Siguiente →</button>
            </div>
          )}

          {/* ── Step 2: Mapa por zonas ── */}
          {step === 2 && (
            <div className="step-content">
              <h3>Elige tu mesa</h3>
              <p className="step-desc">{form.fecha} | {form.hora} | {form.personas} personas</p>

              {/* Leyenda */}
              <div className="mapa-leyenda">
                <span className="leyenda-chip verde">🪑 Disponible</span>
                <span className="leyenda-chip rojo">🔴 Ocupada</span>
                <span className="leyenda-chip gris">⚫ Sin capacidad</span>
                <span className="leyenda-chip naranja">⭐ Tu selección</span>
              </div>

              {/* Mapa */}
              <div className="mapa-restaurante">
                {Object.entries(mesasPorZona).map(([zona, mesasZona]) => (
                  <div key={zona} className="mapa-zona">
                    <div className="mapa-zona-header">
                      <span>{ZONA_ICON[zona] || "🪑"}</span>
                      <strong>{zona}</strong>
                      <span className="mapa-zona-libre">
                        {mesasZona.filter(m => m.disponible).length} libre(s)
                      </span>
                    </div>
                    <div className="mapa-zona-mesas">
                      {mesasZona.map(mesa => {
                        const sel = form.mesaId === mesa.id;
                        return (
                          <div
                            key={mesa.id}
                            className={[
                              "mesa-mapa-card",
                              mesa.disponible ? "mesa-libre" : "mesa-bloqueada",
                              sel ? "mesa-elegida" : "",
                            ].filter(Boolean).join(" ")}
                            onClick={() => {
                              if (!mesa.disponible) return;
                              setForm({ ...form, mesaId: mesa.id });
                              setError("");
                            }}
                            title={mesa.disponible
                              ? `Mesa ${mesa.numero} · ${mesa.zona} · ${mesa.capacidad} personas`
                              : mesa.motivo === "ocupada" ? "Ya reservada en este horario" : "Capacidad insuficiente"
                            }
                          >
                            <div className="mmc-numero">Mesa {mesa.numero}</div>
                            <div className="mmc-icono">
                              {sel ? "⭐" : mesa.disponible ? "🪑" : mesa.motivo === "ocupada" ? "🔴" : "⚫"}
                            </div>
                            <div className="mmc-cap">👥 {mesa.capacidad}</div>
                            {!mesa.disponible && (
                              <div className="mmc-tag">
                                {mesa.motivo === "ocupada" ? "Ocupada" : "Sin cap."}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de selección */}
              {mesaSeleccionada && (
                <div className="mesa-elegida-resumen">
                  ⭐ Seleccionaste: <strong>Mesa {mesaSeleccionada.numero}</strong> · {mesaSeleccionada.zona} · {mesaSeleccionada.capacidad} personas
                </div>
              )}

              <div className="step-actions">
                <button onClick={() => setStep(1)} className="btn-outline">← Atrás</button>
                <button onClick={handleStep2} className="btn-primary">Siguiente →</button>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="step-content">
              <h3>Confirmar Reserva</h3>
              <div className="confirm-summary">
                <div className="summary-row"><span>👤 Cliente:</span><strong>{user?.name}</strong></div>
                <div className="summary-row"><span>📅 Fecha:</span><strong>{form.fecha}</strong></div>
                <div className="summary-row"><span>🕐 Hora:</span><strong>{form.hora}</strong></div>
                <div className="summary-row"><span>👥 Personas:</span><strong>{form.personas}</strong></div>
                <div className="summary-row"><span>🪑 Mesa:</span><strong>Mesa {mesaSeleccionada?.numero} — {mesaSeleccionada?.zona}</strong></div>
              </div>
              <div className="form-group">
                <label>📝 Notas especiales (opcional)</label>
                <textarea value={form.notas} onChange={handleChange("notas")} placeholder="Ej: Cumpleaños, alergias, silla para niño..." rows={3}></textarea>
              </div>
              <div className="step-actions">
                <button onClick={() => setStep(2)} className="btn-outline">← Atrás</button>
                <button onClick={handleConfirmar} className="btn-primary" disabled={loading}>
                  {loading ? <span className="spinner-sm"></span> : "✅ Confirmar Reserva"}
                </button>
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
