const Footer = () => (
  <footer className="site-footer">
    <div className="footer-container">
      <div className="footer-brand">
        <div className="footer-logo">✦ Pachacamac</div>
        <p>Cocina peruana de autor en el corazón de Miraflores. Una experiencia gastronómica que celebra la biodiversidad y la riqueza culinaria del Perú.</p>
        <div className="footer-socials">
          {["📸","📘","🐦","💬","▶️"].map((s,i)=>(
            <a key={i} href="#!" className="social-link">{s}</a>
          ))}
        </div>
      </div>

      <div className="footer-links">
        <h4>Navegación</h4>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#servicios">Eventos Privados</a></li>
          <li><a href="#carta">La Carta</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </div>

      <div className="footer-links">
        <h4>Servicios</h4>
        <ul>
          <li><a href="#!">Reservas Online</a></li>
          <li><a href="#!">Eventos Corporativos</a></li>
          <li><a href="#!">Cenas Románticas</a></li>
          <li><a href="#!">Menú Degustación</a></li>
          <li><a href="#!">Catas & Maridajes</a></li>
        </ul>
      </div>

      <div className="footer-contact">
        <h4>Visítanos</h4>
        <div className="contact-item"><span>🏠</span><span>Av. La Mar 1050, Miraflores, Lima</span></div>
        <div className="contact-item"><span>📞</span><span>(01) 445-3210</span></div>
        <div className="contact-item"><span>✉️</span><span>reservas@pachacamac.pe</span></div>
        <div className="contact-item"><span>🕐</span><span>Mar–Dom: 12:30 – 23:00</span></div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 Pachacamac Restaurante. Todos los derechos reservados.</p>
      <div className="footer-bottom-links">
        <a href="#!">Política de Privacidad</a>
        <a href="#!">Términos</a>
      </div>
    </div>
  </footer>
);

export default Footer;
