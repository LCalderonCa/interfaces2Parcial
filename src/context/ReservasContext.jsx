import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";

const ReservasContext = createContext(null);

// ── Conversión snake_case (Laravel) ↔ camelCase (React) ──────

function mesaDesdeAPI(m) {
  return { id: m.id, numero: m.numero, capacidad: m.capacidad, zona: m.zona, estado: m.estado };
}

function reservaDesdeAPI(r) {
  return {
    id:            r.id,
    clienteNombre: r.cliente_nombre,
    clienteEmail:  r.cliente_email,
    mesaId:        r.mesa_id,
    fecha:         r.fecha,
    hora:          r.hora,
    personas:      r.personas,
    estado:        r.estado,
    notas:         r.notas || "",
  };
}

// ── Reducer ───────────────────────────────────────────────────

const initialState = { mesas: [], reservas: [], cargando: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "SET_MESAS":      return { ...state, mesas: action.payload, cargando: false };
    case "ADD_MESA":       return { ...state, mesas: [...state.mesas, action.payload] };
    case "UPDATE_MESA":    return { ...state, mesas: state.mesas.map(m => m.id === action.payload.id ? action.payload : m) };
    case "DELETE_MESA":    return { ...state, mesas: state.mesas.filter(m => m.id !== action.id) };
    case "SET_RESERVAS":   return { ...state, reservas: action.payload };
    case "ADD_RESERVA":    return { ...state, reservas: [...state.reservas, action.payload] };
    case "UPDATE_RESERVA": return { ...state, reservas: state.reservas.map(r => r.id === action.payload.id ? action.payload : r) };
    case "DELETE_RESERVA": return { ...state, reservas: state.reservas.filter(r => r.id !== action.id) };
    case "SET_ERROR":      return { ...state, error: action.payload, cargando: false };
    default:               return state;
  }
}

// ── Provider ──────────────────────────────────────────────────

export const ReservasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { mesas, reservas, cargando, error } = state;

  // Carga inicial desde la API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mesasData, reservasData] = await Promise.all([
          api.mesas.getAll(),
          api.reservas.getAll(),
        ]);
        dispatch({ type: "SET_MESAS",    payload: mesasData.map(mesaDesdeAPI) });
        dispatch({ type: "SET_RESERVAS", payload: reservasData.map(reservaDesdeAPI) });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "No se pudo conectar con el servidor. Verifica que XAMPP esté activo." });
      }
    };
    cargarDatos();
  }, []);

  // ── Reservas ──────────────────────────────────────────────────

  const crearReserva = useCallback(async (datos) => {
    try {
      const nueva = await api.reservas.crear({
        cliente_nombre: datos.clienteNombre,
        cliente_email:  datos.clienteEmail,
        mesa_id:        datos.mesaId,
        fecha:          datos.fecha,
        hora:           datos.hora,
        personas:       datos.personas,
        notas:          datos.notas || "",
      });
      const formateada = reservaDesdeAPI(nueva);
      dispatch({ type: "ADD_RESERVA", payload: formateada });
      return { success: true, reserva: formateada };
    } catch (err) {
      return { success: false, message: err.message || "Error al crear reserva" };
    }
  }, []);

  const actualizarEstadoReserva = useCallback(async (id, estado) => {
    try {
      const actualizada = await api.reservas.actualizar(id, { estado });
      dispatch({ type: "UPDATE_RESERVA", payload: reservaDesdeAPI(actualizada) });
    } catch (err) {
      console.error("Error al actualizar reserva:", err.message);
    }
  }, []);

  const eliminarReserva = useCallback(async (id) => {
    try {
      await api.reservas.eliminar(id);
      dispatch({ type: "DELETE_RESERVA", id });
    } catch (err) {
      console.error("Error al eliminar reserva:", err.message);
    }
  }, []);

  // ── Mesas ─────────────────────────────────────────────────────

  const agregarMesa = useCallback(async (datos) => {
    try {
      const nueva = await api.mesas.crear(datos);
      const formateada = mesaDesdeAPI(nueva);
      dispatch({ type: "ADD_MESA", payload: formateada });
      return formateada;
    } catch (err) {
      console.error("Error al agregar mesa:", err.message);
      return null;
    }
  }, []);

  const actualizarMesa = useCallback(async (id, datos) => {
    try {
      const actualizada = await api.mesas.actualizar(id, datos);
      dispatch({ type: "UPDATE_MESA", payload: mesaDesdeAPI(actualizada) });
    } catch (err) {
      console.error("Error al actualizar mesa:", err.message);
    }
  }, []);

  const eliminarMesa = useCallback(async (id) => {
    try {
      await api.mesas.eliminar(id);
      dispatch({ type: "DELETE_MESA", id });
    } catch (err) {
      console.error("Error al eliminar mesa:", err.message);
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────

  const getMesasDisponibles = useCallback((fecha, hora, personas) =>
    mesas.filter(mesa => {
      if (mesa.capacidad < personas) return false;
      return !reservas.find(
        r => r.mesaId === mesa.id && r.fecha === fecha && r.hora === hora && r.estado !== "cancelada"
      );
    }),
  [mesas, reservas]);

  const getReservasByFecha = useCallback((fecha) =>
    reservas.filter(r => r.fecha === fecha && r.estado !== "cancelada"),
  [reservas]);

  // Stats pre-calculadas para Dashboard y Reportes
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total:       reservas.length,
      pendientes:  reservas.filter(r => r.estado === "pendiente").length,
      confirmadas: reservas.filter(r => r.estado === "confirmada").length,
      canceladas:  reservas.filter(r => r.estado === "cancelada").length,
      hoy:         reservas.filter(r => r.fecha === today && r.estado !== "cancelada").length,
      totalMesas:  mesas.length,
    };
  }, [reservas, mesas]);

  return (
    <ReservasContext.Provider value={{
      mesas, reservas, cargando, error, stats,
      crearReserva, actualizarEstadoReserva, eliminarReserva,
      agregarMesa,  actualizarMesa,          eliminarMesa,
      getMesasDisponibles, getReservasByFecha,
    }}>
      {children}
    </ReservasContext.Provider>
  );
};

export const useReservas = () => useContext(ReservasContext);
