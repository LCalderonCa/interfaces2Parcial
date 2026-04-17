# ReservaPlus — Sistema de Gestión de Reservas

> **Pachacamac — Cocina Peruana de Autor**  
> Proyecto final — Desarrollo de Interfaces 2 — IDAT 2025

Sistema fullstack de reservas de mesas para restaurante, compuesto por un frontend en React y un backend REST en Laravel, conectados a una base de datos MySQL gestionada con XAMPP.

---

## Integrantes

| Nombre | Código |
|--------|--------|
| Lucio Calderón Cáceres | IV40568587 |


---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.x |
| Routing | React Router DOM | 7.x |
| Backend | Laravel | 11.x |
| Base de datos | MySQL (XAMPP) | 8.x |
| Servidor local | Apache (XAMPP) | — |
| Diseño UI/UX | Figma | — |
| Pruebas | Jest + Testing Library | — |

---

## Estructura del repositorio

```
reservaplus/                    ← Proyecto React (frontend)
│
├── src/
│   ├── services/
│   │   └── api.js              ← Capa HTTP hacia Laravel
│   ├── context/
│   │   ├── AuthContext.jsx     ← Sesión de usuario (async)
│   │   └── ReservasContext.jsx ← useReducer + useCallback + useMemo
│   ├── components/
│   │   ├── Navbar.jsx          ← React.memo
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── public/             ← HomePage, LoginPage, ReservarPage...
│   │   └── admin/              ← Dashboard, ReservasAdmin, MesasAdmin...
│   ├── App.js                  ← Spinner global de carga
│   ├── App.css                 ← Estilos + microinteracciones CSS
│   └── App.test.js             ← 12 tests automatizados
│
├── package.json
└── README.md

laravel-backend/                ← Proyecto Laravel (backend API)
│
├── app/
│   ├── Http/Controllers/
│   │   ├── MesaController.php
│   │   ├── ReservaController.php
│   │   ├── ClienteController.php
│   │   └── PlatoController.php
│   └── Models/
│       ├── Mesa.php
│       ├── Reserva.php
│       ├── Cliente.php
│       └── Plato.php
├── routes/
│   └── api.php                 ← Rutas REST completas
├── config/
│   └── cors.php                ← CORS habilitado para React
└── database/
    └── reservaplus.sql         ← Script SQL completo
```

---

## Requisitos previos

- **XAMPP** con Apache y MySQL activos
- **Node.js** 18 o superior
- **Composer** instalado
- **PHP** 8.2 o superior

---

## Instalación y configuración

### 1. Base de datos (phpMyAdmin)

1. Abre `http://localhost/phpmyadmin`
2. Crea una base de datos llamada `reservaplus`
3. Importa el archivo `laravel-backend/database/reservaplus.sql`

O ejecuta el script directamente:

```sql
CREATE DATABASE IF NOT EXISTS reservaplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reservaplus;

CREATE TABLE mesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  capacidad INT NOT NULL,
  zona VARCHAR(50) NOT NULL,
  estado VARCHAR(20) DEFAULT 'disponible',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'cliente',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  cliente_nombre VARCHAR(100),
  cliente_email VARCHAR(100),
  mesa_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  personas INT NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  notas TEXT,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (mesa_id) REFERENCES mesa(id)
);

CREATE TABLE platos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(8,2),
  categoria VARCHAR(50),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

-- Datos de prueba: mesas
INSERT INTO mesa (numero, capacidad, zona, estado) VALUES
(1, 2, 'Interior', 'disponible'), (2, 4, 'Interior', 'disponible'),
(3, 4, 'Terraza', 'disponible'),  (4, 6, 'Terraza', 'disponible'),
(5, 2, 'Barra', 'disponible'),    (6, 8, 'Salón VIP', 'disponible'),
(7, 4, 'Interior', 'disponible'), (8, 2, 'Terraza', 'disponible');

-- Datos de prueba: clientes
INSERT INTO cliente (name, email, password, role) VALUES
('Admin Sistema',  'admin@reservaplus.com', 'admin123',   'admin'),
('Carlos Torres',  'carlos@mail.com',       'cliente123', 'cliente'),
('María López',    'maria@mail.com',        'cliente123', 'cliente'),
('Juan Pérez',     'juan@mail.com',         'cliente123', 'cliente'),
('Ana García',     'ana@mail.com',          'cliente123', 'cliente');

-- Datos de prueba: reservas
INSERT INTO reserva (cliente_nombre, cliente_email, mesa_id, fecha, hora, personas, estado, notas) VALUES
('María López', 'maria@mail.com', 2, '2025-08-15', '19:00', 3, 'confirmada', 'Cumpleaños'),
('Juan Pérez',  'juan@mail.com',  4, '2025-08-15', '20:30', 5, 'pendiente',  ''),
('Ana García',  'ana@mail.com',   1, '2025-08-16', '13:00', 2, 'confirmada', 'Aniversario');

-- Datos de prueba: platos
INSERT INTO platos (nombre, descripcion, precio, categoria) VALUES
('Ceviche Clásico',  'Pescado fresco marinado en limón con ají',         45.00, 'Entradas'),
('Lomo Saltado',     'Tiras de lomo fino salteadas con verduras',         52.00, 'Fondos'),
('Aji de Gallina',   'Gallina deshilachada en crema de ají amarillo',     38.00, 'Fondos'),
('Chicha Morada',    'Bebida tradicional de maíz morado',                 12.00, 'Bebidas'),
('Suspiro Limeño',   'Postre tradicional limeño con manjar y merengue',   18.00, 'Postres');
```

---

### 2. Backend Laravel

El proyecto Laravel se encuentra en `laravel-backend/` (proyecto enviado por el profesor con el nombre `idatrestaurant2025`).

**Configurar `.env`:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=reservaplus
DB_USERNAME=root
DB_PASSWORD=
```

**Archivos modificados respecto al proyecto original:**

| Archivo | Cambio realizado |
|---------|-----------------|
| `routes/api.php` | Se agregaron rutas POST, PUT, DELETE para mesas, reservas y clientes. Se agregó ruta de login. |
| `app/Http/Controllers/MesaController.php` | Se implementaron `store`, `show`, `update`, `destroy` |
| `app/Http/Controllers/ReservaController.php` | Se implementaron todos los métodos + validación de conflicto de horario + `porCliente` |
| `app/Http/Controllers/ClienteController.php` | Se implementaron todos los métodos + método `login` |
| `app/Models/Mesa.php` | Se agregó `$fillable` |
| `app/Models/Reserva.php` | Se agregó `$fillable` |
| `app/Models/Cliente.php` | Se agregó `$fillable` y `$hidden` |
| `config/cors.php` | Se creó el archivo habilitando CORS para `http://localhost:3000` |

**Verificar que la API funciona:**

Abre en el navegador:
```
http://localhost/idatrestaurant2025/public/api/test
```
Debe devolver: `{"status":"api funcionando","proyecto":"ReservaPlus"}`

```
http://localhost/idatrestaurant2025/public/api/mesas
```
Debe devolver el array JSON con las 8 mesas.

---

### 3. Frontend React

```bash
# Entrar a la carpeta del proyecto React
cd reservaplus

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

La aplicación abre en `http://localhost:3000`

**Credenciales de prueba:**

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@reservaplus.com | admin123 |
| Cliente | carlos@mail.com | cliente123 |

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/test` | Verificar que la API responde |
| GET | `/api/mesas` | Listar todas las mesas |
| POST | `/api/mesas` | Crear nueva mesa |
| PUT | `/api/mesas/{id}` | Actualizar mesa |
| DELETE | `/api/mesas/{id}` | Eliminar mesa |
| GET | `/api/reservas` | Listar todas las reservas |
| POST | `/api/reservas` | Crear reserva (valida conflicto de horario) |
| PUT | `/api/reservas/{id}` | Actualizar estado de reserva |
| DELETE | `/api/reservas/{id}` | Eliminar reserva |
| GET | `/api/reservas/cliente/{email}` | Reservas por email de cliente |
| POST | `/api/clientes/login` | Autenticación de usuario |
| POST | `/api/clientes` | Registrar nuevo cliente |
| GET | `/api/platos` | Listar el menú del restaurante |

---

## Pruebas automatizadas

```bash
cd reservaplus
npm test
```

**Resultado esperado: 12 tests pasando ✅**

```
PASS  src/App.test.js
  √ AuthContext: estado inicial es sin sesión
  √ ReservasContext: tiene 2 mesas de prueba
  √ ReservasContext: tiene 1 reserva de prueba
  √ ReservasContext: primera mesa es de zona Interior
  √ ReservasContext: clienteNombre está en camelCase
  √ ReservasContext: actualizar estado cambia confirmada → cancelada
  √ ReservasContext: eliminar reserva reduce el total a 0
  √ Validación: detecta nombre vacío
  √ Validación: detecta email inválido
  √ Validación: detecta contraseña corta
  √ Validación: detecta contraseñas distintas
  √ Validación: sin errores con datos válidos

Tests: 12 passed, 12 total
```

> Los tests no requieren XAMPP activo — utilizan un contexto de prueba con datos inyectados directamente.

---

## Optimizaciones implementadas

| Técnica | Archivo | Beneficio |
|---------|---------|-----------|
| `React.memo` | `Navbar.jsx` | Evita re-renders al cambiar reservas |
| `useCallback` | `ReservasContext.jsx` | Referencia estable en todas las funciones |
| `useMemo` | `ReservasContext.jsx` | Stats del dashboard calculadas una sola vez |
| `useMemo` | `ReservasAdmin.jsx` | Filtrado de tabla sin recalcular innecesariamente |
| `useReducer` | `ReservasContext.jsx` | Estado predecible con acciones tipadas |
| CSS animations | `App.css` | 14 microinteracciones sin librerías externas |



---

## Licencia

Proyecto académico — IDAT 2025
