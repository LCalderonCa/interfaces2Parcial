import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../data/db";

const ReservasContext = createContext(null);

export const ReservasProvider = ({ children }) => {
  const [mesas,    setMesas]    = useState(() => db.mesas.getAll());
  const [reservas, setReservas] = useState(() => db.reservas.getAll());

  // Persistir cada vez que cambian
  useEffect(() => { db.mesas.save(mesas);       }, [mesas]);
  useEffect(() => { db.reservas.save(reservas); }, [reservas]);

  // ── Reservas ─────────────────────────────────────────────────

  const crearReserva = (datos) => {
    const conflicto = reservas.find(
      r => r.mesaId === datos.mesaId &&
           r.fecha  === datos.fecha  &&
           r.hora   === datos.hora   &&
           r.estado !== "cancelada"
    );
    if (conflicto) return { success: false, message: "Esa mesa ya está reservada en ese horario" };
    const nueva = { id: Date.now(), ...datos, estado: "pendiente" };
    setReservas(prev => [...prev, nueva]);
    return { success: true, reserva: nueva };
  };

  const actualizarEstadoReserva = (id, estado) =>
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado } : r));

  const eliminarReserva = (id) =>
    setReservas(prev => prev.filter(r => r.id !== id));

  // ── Mesas ─────────────────────────────────────────────────────

  const agregarMesa = (datos) => {
    const nueva = { id: Date.now(), ...datos, estado: "disponible" };
    setMesas(prev => [...prev, nueva]);
    return nueva;
  };

  const actualizarMesa = (id, datos) =>
    setMesas(prev => prev.map(m => m.id === id ? { ...m, ...datos } : m));

  const eliminarMesa = (id) =>
    setMesas(prev => prev.filter(m => m.id !== id));

  // ── Helpers ───────────────────────────────────────────────────

  const getMesasDisponibles = (fecha, hora, personas) =>
    mesas.filter(mesa => {
      if (mesa.capacidad < personas) return false;
      return !reservas.find(
        r => r.mesaId === mesa.id &&
             r.fecha  === fecha   &&
             r.hora   === hora    &&
             r.estado !== "cancelada"
      );
    });

  const getReservasByFecha = (fecha) =>
    reservas.filter(r => r.fecha === fecha && r.estado !== "cancelada");

  return (
    <ReservasContext.Provider value={{
      mesas, reservas,
      crearReserva, actualizarEstadoReserva, eliminarReserva,
      agregarMesa,  actualizarMesa,          eliminarMesa,
      getMesasDisponibles, getReservasByFecha,
    }}>
      {children}
    </ReservasContext.Provider>
  );
};

export const useReservas = () => useContext(ReservasContext);
