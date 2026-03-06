/**
 * db.js — Capa de datos local
 *
 * Simula una base de datos usando localStorage.
 * Los archivos JSON en /data/ son los datos iniciales (seed).
 * En el futuro, reemplazar las funciones de este archivo
 * por llamadas reales a una API/backend.
 *
 * Uso:
 *   import { db } from './db';
 *   const mesas = db.mesas.getAll();
 *   db.mesas.save(listaMesas);
 */

import mesasSeed    from './mesas.json';
import reservasSeed from './reservas.json';
import usuariosSeed from './usuarios.json';

// ── Claves de localStorage ────────────────────────────────────
const KEYS = {
  mesas:    'rp_mesas',
  reservas: 'rp_reservas',
  usuarios: 'rp_usuarios',
};

// ── Helpers genéricos ─────────────────────────────────────────

/** Lee del localStorage; si no existe carga el seed JSON */
function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

/** Persiste un array en localStorage */
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/** Resetea una colección a sus datos iniciales */
function reset(key, seed) {
  save(key, seed);
}

// ── API de colecciones ────────────────────────────────────────

export const db = {

  mesas: {
    getAll:  ()       => load(KEYS.mesas, mesasSeed),
    save:    (data)   => save(KEYS.mesas, data),
    reset:   ()       => reset(KEYS.mesas, mesasSeed),
  },

  reservas: {
    getAll:  ()       => load(KEYS.reservas, reservasSeed),
    save:    (data)   => save(KEYS.reservas, data),
    reset:   ()       => reset(KEYS.reservas, reservasSeed),
  },

  usuarios: {
    getAll:  ()       => load(KEYS.usuarios, usuariosSeed),
    save:    (data)   => save(KEYS.usuarios, data),
    reset:   ()       => reset(KEYS.usuarios, usuariosSeed),
  },

};
