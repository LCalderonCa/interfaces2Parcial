import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useReservas } from "../../context/ReservasContext";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLOR = {
  primary:   "#e07b39",
  primaryDk: "#c4621f",
  success:   "#27ae60",
  warning:   "#f39c12",
  danger:    "#e74c3c",
  blue:      "#2980b9",
  purple:    "#8e44ad",
  gray:      "#e5e7eb",
  text:      "#2d3436",
  muted:     "#636e72",
};

const tooltipBase = {
  backgroundColor: "rgba(30,20,10,0.88)",
  titleColor:      "#fff",
  bodyColor:       "#f5ede4",
  borderColor:     COLOR.primary,
  borderWidth:     1,
  padding:         10,
  cornerRadius:    8,
};

const KpiCard = ({ icon, valor, label, color, sub }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{valor}</span>
      <span className="stat-label">{label}</span>
      {sub && <span style={{ fontSize: "0.7rem", color: COLOR.muted, marginTop: "2px" }}>{sub}</span>}
    </div>
  </div>
);

const ReportesAdmin = () => {
  const { reservas, mesas } = useReservas();

  const stats = useMemo(() => {
    const total       = reservas.length;
    const confirmadas = reservas.filter(r => r.estado === "confirmada").length;
    const pendientes  = reservas.filter(r => r.estado === "pendiente").length;
    const canceladas  = reservas.filter(r => r.estado === "cancelada").length;
    const activas     = total - canceladas;
    const totalPersonas = reservas
      .filter(r => r.estado !== "cancelada")
      .reduce((sum, r) => sum + r.personas, 0);
    const promPersonas = activas > 0 ? (totalPersonas / activas).toFixed(1) : 0;

    const byDia = {};
    reservas.forEach(r => { byDia[r.fecha] = (byDia[r.fecha] || 0) + 1; });
    const diasOrdenados = Object.entries(byDia)
      .sort((a, b) => a[0].localeCompare(b[0])).slice(0, 7);

    const byHora = {};
    reservas.forEach(r => { byHora[r.hora] = (byHora[r.hora] || 0) + 1; });
    const horasOrdenadas = Object.entries(byHora)
      .sort((a, b) => b[1] - a[1]).slice(0, 7);

    const byMesa = {};
    reservas.forEach(r => { byMesa[r.mesaId] = (byMesa[r.mesaId] || 0) + 1; });
    const topMesas = Object.entries(byMesa)
      .sort((a, b) => b[1] - a[1]).slice(0, 6);

    return {
      total, confirmadas, pendientes, canceladas,
      totalPersonas, promPersonas,
      diasOrdenados, horasOrdenadas, topMesas,
    };
  }, [reservas]);

  const pct = (v) => stats.total > 0 ? Math.round((v / stats.total) * 100) : 0;

  const getMesaLabel = (id) => {
    const m = mesas.find(m => m.id === parseInt(id));
    return m ? `Mesa ${m.numero}` : `#${id}`;
  };

  // ── Datos Chart.js ─────────────────────────────────────────

  const donaData = {
    labels: ["Confirmadas", "Pendientes", "Canceladas"],
    datasets: [{
      data: [stats.confirmadas, stats.pendientes, stats.canceladas],
      backgroundColor: [COLOR.success, COLOR.primary, COLOR.danger],
      borderColor:     ["#fff","#fff","#fff"],
      borderWidth: 3,
      hoverOffset: 12,
    }],
  };

  const donaOptions = {
    responsive: true, maintainAspectRatio: false, cutout: "68%",
    animation: { animateRotate: true, duration: 900 },
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 16, color: COLOR.text, usePointStyle: true, pointStyleWidth: 10,
          font: { family: "DM Sans, sans-serif", size: 12 } },
      },
      tooltip: { ...tooltipBase,
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${pct(ctx.raw)}%)` },
      },
    },
  };

  const diasData = {
    labels: stats.diasOrdenados.map(([f]) => f.slice(5)),
    datasets: [{
      label: "Reservas",
      data: stats.diasOrdenados.map(([, c]) => c),
      backgroundColor: stats.diasOrdenados.map((_, i) =>
        i === 0 ? COLOR.primaryDk : COLOR.primary),
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const diasOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipBase,
        callbacks: {
          title: (items) => `Fecha: ${stats.diasOrdenados[items[0].dataIndex]?.[0] || ""}`,
          label: (ctx) => ` ${ctx.raw} reserva(s)`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: COLOR.muted, font: { size: 11 } } },
      y: { beginAtZero: true, grid: { color: COLOR.gray },
           ticks: { color: COLOR.muted, stepSize: 1, font: { size: 11 } } },
    },
  };

  const horasData = {
    labels: stats.horasOrdenadas.map(([h]) => h),
    datasets: [{
      label: "Reservas",
      data: stats.horasOrdenadas.map(([, c]) => c),
      backgroundColor: stats.horasOrdenadas.map((_, i) =>
        `rgba(41,128,185,${Math.max(0.4, 0.95 - i * 0.08)})`),
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const horasOptions = {
    indexAxis: "y",
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipBase,
        callbacks: { label: (ctx) => ` ${ctx.raw} reserva(s)` },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: COLOR.gray },
           ticks: { color: COLOR.muted, stepSize: 1, font: { size: 11 } } },
      y: { grid: { display: false },
           ticks: { color: COLOR.text, font: { size: 12, weight: "600" } } },
    },
  };

  const mesasData = {
    labels: stats.topMesas.map(([id]) => getMesaLabel(id)),
    datasets: [{
      label: "Reservas",
      data: stats.topMesas.map(([, c]) => c),
      backgroundColor: stats.topMesas.map((_, i) =>
        `rgba(142,68,173,${Math.max(0.4, 0.95 - i * 0.1)})`),
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const mesasOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipBase,
        callbacks: {
          title: (items) => {
            const [id] = stats.topMesas[items[0].dataIndex] || [];
            const m = mesas.find(m => m.id === parseInt(id));
            return m ? `Mesa ${m.numero} — ${m.zona}` : `Mesa #${id}`;
          },
          label: (ctx) => ` ${ctx.raw} reserva(s)`,
        },
      },
    },
    scales: {
      x: { grid: { display: false },
           ticks: { color: COLOR.text, font: { size: 11, weight: "600" } } },
      y: { beginAtZero: true, grid: { color: COLOR.gray },
           ticks: { color: COLOR.muted, stepSize: 1, font: { size: 11 } } },
    },
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Reportes y Estadísticas</h1>
          <nav className="breadcrumb">
            <span>Dashboard</span> / <span className="active">Reportes</span>
          </nav>
        </div>

        {/* KPI cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <KpiCard icon="📋" valor={stats.total}
            label="Total Reservas" color="orange" />
          <KpiCard icon="✅" valor={`${pct(stats.confirmadas)}%`}
            label="Tasa de confirmación" color="green"
            sub={`${stats.confirmadas} confirmadas`} />
          <KpiCard icon="👥" valor={stats.totalPersonas}
            label="Comensales totales" color="blue"
            sub={`~${stats.promPersonas} por reserva`} />
          <KpiCard icon="❌" valor={`${pct(stats.canceladas)}%`}
            label="Tasa de cancelación" color="red"
            sub={`${stats.canceladas} canceladas`} />
        </div>

        {/* Fila 2: Dona + Días */}
        <div className="rpt-fila-2">
          <div className="rpt-panel">
            <div className="rpt-panel-header"><span>🍩</span><h3>Distribución por estado</h3></div>
            {stats.total === 0
              ? <p className="rpt-empty">Sin reservas aún</p>
              : <div style={{ height: "280px" }}><Doughnut data={donaData} options={donaOptions} /></div>
            }
          </div>
          <div className="rpt-panel">
            <div className="rpt-panel-header"><span>📅</span><h3>Reservas por día</h3></div>
            {stats.diasOrdenados.length === 0
              ? <p className="rpt-empty">Sin datos aún</p>
              : <div style={{ height: "280px" }}><Bar data={diasData} options={diasOptions} /></div>
            }
          </div>
        </div>

        {/* Fila 3: Horarios + Mesas */}
        <div className="rpt-fila-2">
          <div className="rpt-panel">
            <div className="rpt-panel-header"><span>🕐</span><h3>Horarios más demandados</h3></div>
            {stats.horasOrdenadas.length === 0
              ? <p className="rpt-empty">Sin datos aún</p>
              : <div style={{ height: "260px" }}><Bar data={horasData} options={horasOptions} /></div>
            }
          </div>
          <div className="rpt-panel">
            <div className="rpt-panel-header"><span>🪑</span><h3>Mesas más reservadas</h3></div>
            {stats.topMesas.length === 0
              ? <p className="rpt-empty">Sin datos aún</p>
              : <div style={{ height: "260px" }}><Bar data={mesasData} options={mesasOptions} /></div>
            }
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ReportesAdmin;
