import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/admin/reservas", icon: "📅", label: "Reservas" },
    { path: "/admin/mesas", icon: "🪑", label: "Gestionar Mesas" },
    { path: "/admin/calendario", icon: "🗓", label: "Calendario" },
    { path: "/admin/reportes", icon: "📈", label: "Reportes" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Topbar */}
      <nav className="admin-topbar">
        <div className="topbar-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <span className="admin-brand">🍽 ReservaPlus Admin</span>
        </div>
        <div className="topbar-right">
          <div className="admin-user-menu">
            <span className="user-avatar">👤</span>
            <span className="user-name">{user?.name}</span>
            <div className="user-dropdown">
              <Link to="/" className="dropdown-item">🌐 Ver Sitio</Link>
              <button onClick={handleLogout} className="dropdown-item danger">🚪 Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
