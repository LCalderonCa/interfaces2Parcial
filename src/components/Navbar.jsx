import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// React.memo evita que Navbar se re-renderice cuando cambian
// datos que no le afectan (ej: lista de reservas actualizada)
const Navbar = memo(() => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // useCallback: la función logout no se recrea en cada render
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const navLinks = [
    { label: "Inicio",   href: "#inicio" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Eventos",  href: "#servicios" },
    { label: "Carta",    href: "#carta" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <nav className={`public-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">Pachacamac</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link"
               onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}

          {user ? (
            <div className="nav-user">
              <span className="user-greeting">Hola, {user.name.split(" ")[0]}</span>
              {user.role === "admin" && (
                <Link to="/admin" className="btn-admin">Panel Admin</Link>
              )}
              <Link to="/mis-reservas" className="btn-nav-outline">Mis Reservas</Link>
              <button onClick={handleLogout} className="btn-nav-ghost">Salir</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login"    className="btn-nav-outline">Iniciar Sesión</Link>
              <Link to="/registro" className="btn-nav-primary">Reservar Mesa</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
