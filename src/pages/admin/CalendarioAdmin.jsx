import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";

const CalendarioAdmin = () => {
  const { reservas, mesas } = useReservas();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const dayNames = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getDateStr = (day) => {
    if (!day) return null;
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getReservasForDay = (day) => {
    const dateStr = getDateStr(day);
    if (!dateStr) return [];
    return reservas.filter((r) => r.fecha === dateStr && r.estado !== "cancelada");
  };

  const reservasSelectedDate = reservas.filter((r) => r.fecha === selectedDate && r.estado !== "cancelada");

  const getMesa = (id) => mesas.find((m) => m.id === id);

  const estadoBadge = (estado) => {
    if (estado === "confirmada") return "badge-success";
    if (estado === "pendiente") return "badge-warning";
    return "";
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Calendario de Reservas</h1>
          <nav className="breadcrumb">
            <span>Dashboard</span> / <span className="active">Calendario</span>
          </nav>
        </div>

        <div className="calendar-layout">
          {/* Calendar */}
          <div className="calendar-widget">
            <div className="calendar-nav">
              <button onClick={prevMonth} className="cal-btn">◀</button>
              <h3>{monthNames[month]} {year}</h3>
              <button onClick={nextMonth} className="cal-btn">▶</button>
            </div>

            <div className="calendar-grid">
              {dayNames.map((d) => (
                <div key={d} className="cal-header-cell">{d}</div>
              ))}
              {days.map((day, i) => {
                const dateStr = getDateStr(day);
                const dayReservas = day ? getReservasForDay(day) : [];
                const isToday = dateStr === today.toISOString().split("T")[0];
                const isSelected = dateStr === selectedDate;

                return (
                  <div
                    key={i}
                    className={`cal-cell ${!day ? "empty" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${dayReservas.length > 0 ? "has-reservas" : ""}`}
                    onClick={() => day && setSelectedDate(dateStr)}
                  >
                    {day && (
                      <>
                        <span className="cal-day">{day}</span>
                        {dayReservas.length > 0 && (
                          <span className="cal-badge">{dayReservas.length}</span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="cal-legend">
              <div className="legend-item"><span className="legend-dot today-dot"></span> Hoy</div>
              <div className="legend-item"><span className="legend-dot has-reservas-dot"></span> Con reservas</div>
              <div className="legend-item"><span className="legend-dot selected-dot"></span> Seleccionado</div>
            </div>
          </div>

          {/* Day detail */}
          <div className="day-detail">
            <h3>
              📅 Reservas del {selectedDate}
              <span className="day-count">{reservasSelectedDate.length} reserva(s)</span>
            </h3>

            {reservasSelectedDate.length === 0 ? (
              <div className="empty-state-sm">
                <p>No hay reservas para este día</p>
              </div>
            ) : (
              <div className="day-reservas-list">
                {reservasSelectedDate
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map((r) => {
                    const mesa = getMesa(r.mesaId);
                    return (
                      <div key={r.id} className={`day-reserva-item ${r.estado}`}>
                        <div className="reserva-time">{r.hora}</div>
                        <div className="reserva-details">
                          <strong>{r.clienteNombre}</strong>
                          <span>{r.personas} personas • {mesa ? `Mesa ${mesa.numero} (${mesa.zona})` : `Mesa #${r.mesaId}`}</span>
                          {r.notas && <em>{r.notas}</em>}
                        </div>
                        <span className={`estado-badge ${estadoBadge(r.estado)}`}>{r.estado}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CalendarioAdmin;
