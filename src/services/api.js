/**
 * api.js — Capa de servicios para conectar React con el backend Laravel
 *
 * URL base: http://localhost/idatrestaurant2025/public/api
 *
 * Uso:
 *   import api from '../services/api';
 *   const mesas = await api.mesas.getAll();
 *   await api.reservas.crear({ mesa_id: 2, fecha: '2025-08-15', ... });
 */

const BASE_URL = 'http://localhost/idatrestaurant2025/public/api';

// Helper genérico para fetch con JSON
async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    // Lanza el mensaje de error que viene de Laravel
    throw new Error(data.message || `Error ${response.status}`);
  }
  return data;
}

// ── Mesas ──────────────────────────────────────────────────────────────────

const mesas = {
  /** Obtener todas las mesas */
  getAll: () => request('GET', '/mesas'),

  /** Crear nueva mesa */
  crear: (datos) => request('POST', '/mesas', datos),

  /** Actualizar mesa por ID */
  actualizar: (id, datos) => request('PUT', `/mesas/${id}`, datos),

  /** Eliminar mesa por ID */
  eliminar: (id) => request('DELETE', `/mesas/${id}`),
};

// ── Reservas ───────────────────────────────────────────────────────────────

const reservas = {
  /** Obtener todas las reservas */
  getAll: () => request('GET', '/reservas'),

  /** Obtener reservas de un cliente por email */
  porCliente: (email) => request('GET', `/reservas/cliente/${encodeURIComponent(email)}`),

  /** Crear nueva reserva */
  crear: (datos) => request('POST', '/reservas', datos),

  /** Actualizar estado u otros campos de una reserva */
  actualizar: (id, datos) => request('PUT', `/reservas/${id}`, datos),

  /** Eliminar reserva por ID */
  eliminar: (id) => request('DELETE', `/reservas/${id}`),
};

// ── Clientes ───────────────────────────────────────────────────────────────

const clientes = {
  /** Login: devuelve { success, user } */
  login: (email, password) => request('POST', '/clientes/login', { email, password }),

  /** Registro: crea nuevo cliente */
  registrar: (name, email, password) =>
    request('POST', '/clientes', { name, email, password, role: 'cliente' }),

  /** Obtener todos los clientes (solo admin) */
  getAll: () => request('GET', '/clientes'),
};

// ── Platos ─────────────────────────────────────────────────────────────────

const platos = {
  /** Obtener todos los platos */
  getAll: () => request('GET', '/platos'),
};

// ── Export ─────────────────────────────────────────────────────────────────

const api = { mesas, reservas, clientes, platos };

export default api;
