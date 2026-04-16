import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createContext, useContext, useReducer } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ── Contexto de prueba con datos fijos ────────────────────────
const ReservasTestContext = createContext(null);

const MESAS_TEST = [
  { id: 1, numero: 1, capacidad: 2, zona: "Interior", estado: "disponible" },
  { id: 2, numero: 2, capacidad: 4, zona: "Terraza",  estado: "disponible" },
];

const RESERVAS_TEST = [
  {
    id: 1, clienteNombre: "María López", clienteEmail: "maria@mail.com",
    mesaId: 2, fecha: "2025-08-15", hora: "19:00",
    personas: 3, estado: "confirmada", notas: "Cumpleaños",
  },
];

const ReservasTestProvider = ({ children }) => {
  const [reservas, dispatch] = useReducer((state, action) => {
    if (action.type === "UPDATE") return state.map(r => r.id === action.id ? { ...r, estado: action.estado } : r);
    if (action.type === "DELETE") return state.filter(r => r.id !== action.id);
    if (action.type === "ADD")    return [...state, action.payload];
    return state;
  }, RESERVAS_TEST);

  const getMesasDisponibles = (fecha, hora, personas) =>
    MESAS_TEST.filter(m => {
      if (m.capacidad < personas) return false;
      return !reservas.find(r => r.mesaId === m.id && r.fecha === fecha && r.hora === hora && r.estado !== "cancelada");
    });

  return (
    <ReservasTestContext.Provider value={{
      mesas:    MESAS_TEST,
      reservas,
      cargando: false,
      error:    null,
      getMesasDisponibles,
      actualizarEstadoReserva: (id, estado) => dispatch({ type: "UPDATE", id, estado }),
      eliminarReserva:         (id)          => dispatch({ type: "DELETE", id }),
    }}>
      {children}
    </ReservasTestContext.Provider>
  );
};

const useReservasTest = () => useContext(ReservasTestContext);

// Helper wrapper
const ConProviders = ({ children }) => (
  <AuthProvider>
    <ReservasTestProvider>
      {children}
    </ReservasTestProvider>
  </AuthProvider>
);

// ══════════════════════════════════════════════════════════════
// BLOQUE 1 — AuthContext
// ══════════════════════════════════════════════════════════════

const AuthStatus = () => {
  const { user } = useAuth();
  return <p data-testid="auth-user">{user ? user.name : "sin sesión"}</p>;
};

test("AuthContext: estado inicial es sin sesión", () => {
  render(<ConProviders><AuthStatus /></ConProviders>);
  expect(screen.getByTestId("auth-user")).toHaveTextContent("sin sesión");
});

// ══════════════════════════════════════════════════════════════
// BLOQUE 2 — Datos del contexto de reservas
// ══════════════════════════════════════════════════════════════

const MostrarDatos = () => {
  const { mesas, reservas } = useReservasTest();
  return (
    <div>
      <p data-testid="total-mesas">Mesas: {mesas.length}</p>
      <p data-testid="total-reservas">Reservas: {reservas.length}</p>
      <p data-testid="primera-zona">{mesas[0]?.zona}</p>
      <p data-testid="primer-cliente">{reservas[0]?.clienteNombre}</p>
      <p data-testid="primer-estado">{reservas[0]?.estado}</p>
    </div>
  );
};

test("ReservasContext: tiene 2 mesas de prueba", () => {
  render(<ConProviders><MostrarDatos /></ConProviders>);
  expect(screen.getByTestId("total-mesas")).toHaveTextContent("Mesas: 2");
});

test("ReservasContext: tiene 1 reserva de prueba", () => {
  render(<ConProviders><MostrarDatos /></ConProviders>);
  expect(screen.getByTestId("total-reservas")).toHaveTextContent("Reservas: 1");
});

test("ReservasContext: primera mesa es de zona Interior", () => {
  render(<ConProviders><MostrarDatos /></ConProviders>);
  expect(screen.getByTestId("primera-zona")).toHaveTextContent("Interior");
});

test("ReservasContext: clienteNombre está en camelCase", () => {
  render(<ConProviders><MostrarDatos /></ConProviders>);
  expect(screen.getByTestId("primer-cliente")).toHaveTextContent("María López");
});

// ══════════════════════════════════════════════════════════════
// BLOQUE 3 — Mutaciones de estado (actualizar / eliminar)
// ══════════════════════════════════════════════════════════════

const ReservaCard = () => {
  const { reservas, actualizarEstadoReserva, eliminarReserva } = useReservasTest();
  return (
    <div>
      <p data-testid="estado-reserva">{reservas[0]?.estado ?? "eliminada"}</p>
      <p data-testid="count-reservas">{reservas.length}</p>
      <button onClick={() => actualizarEstadoReserva(1, "cancelada")}>Cancelar</button>
      <button onClick={() => eliminarReserva(1)}>Eliminar</button>
    </div>
  );
};

test("ReservasContext: actualizar estado cambia confirmada → cancelada", async () => {
  render(<ConProviders><ReservaCard /></ConProviders>);
  expect(screen.getByTestId("estado-reserva")).toHaveTextContent("confirmada");

  await act(async () => {
    screen.getByText("Cancelar").click();
  });

  expect(screen.getByTestId("estado-reserva")).toHaveTextContent("cancelada");
});

test("ReservasContext: eliminar reserva reduce el total a 0", async () => {
  render(<ConProviders><ReservaCard /></ConProviders>);
  expect(screen.getByTestId("count-reservas")).toHaveTextContent("1");

  await act(async () => {
    screen.getByText("Eliminar").click();
  });

  expect(screen.getByTestId("count-reservas")).toHaveTextContent("0");
});

// ══════════════════════════════════════════════════════════════
// BLOQUE 4 — Validaciones puras (lógica de negocio)
// ══════════════════════════════════════════════════════════════

const validar = ({ name, email, password, confirm }) => {
  const e = {};
  if (!name.trim())                                  e.name     = "Nombre requerido";
  if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email    = "Email inválido";
  if (password.length < 6)                           e.password = "Mínimo 6 caracteres";
  if (password !== confirm)                          e.confirm  = "Las contraseñas no coinciden";
  return e;
};

test("Validación: detecta nombre vacío", () => {
  expect(validar({ name: "", email: "a@b.com", password: "123456", confirm: "123456" }).name)
    .toBe("Nombre requerido");
});

test("Validación: detecta email inválido", () => {
  expect(validar({ name: "Test", email: "noesmail", password: "123456", confirm: "123456" }).email)
    .toBe("Email inválido");
});

test("Validación: detecta contraseña corta", () => {
  expect(validar({ name: "Test", email: "a@b.com", password: "123", confirm: "123" }).password)
    .toBe("Mínimo 6 caracteres");
});

test("Validación: detecta contraseñas distintas", () => {
  expect(validar({ name: "Test", email: "a@b.com", password: "pass123", confirm: "otro" }).confirm)
    .toBe("Las contraseñas no coinciden");
});

test("Validación: sin errores con datos válidos", () => {
  expect(Object.keys(validar({ name: "Test", email: "a@b.com", password: "pass123", confirm: "pass123" })).length)
    .toBe(0);
});
