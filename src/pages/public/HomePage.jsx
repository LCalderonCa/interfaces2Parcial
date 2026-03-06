import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

// ── Hero ──────────────────────────────────────────────────────
const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleReservar = () => navigate(user ? "/reservar" : "/login");

  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bg">
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => <div key={i} className={`particle p${i}`}></div>)}
        </div>
      </div>
      <div className={`hero-content ${visible ? "visible" : ""}`}>
        <div className="hero-eyebrow">
          <span className="eyebrow-line"></span>
          <span>Lima, Perú</span>
          <span className="eyebrow-line"></span>
        </div>
        <p className="hero-pretitle">Restaurante</p>
        <h1 className="hero-title">
          Pachacamac<br />
          <span className="hero-subtitle-title">Cocina Peruana de Autor</span>
        </h1>
        <p className="hero-desc">
          Donde los sabores ancestrales del Perú se encuentran con las técnicas<br />
          más refinadas de la gastronomía mundial
        </p>
        <div className="hero-divider"><span>✦</span></div>
        <div className="hero-actions">
          <button onClick={handleReservar} className="btn-hero-primary">
            Reservar Mesa
          </button>
          <a href="#carta" className="btn-hero-secondary">
            Ver Carta
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">15</span>
            <span className="stat-label">Años de experiencia</span>
          </div>
          <div className="stat-sep">|</div>
          <div className="stat">
            <span className="stat-num">40+</span>
            <span className="stat-label">Platos únicos</span>
          </div>
          <div className="stat-sep">|</div>
          <div className="stat">
            <span className="stat-num">★ 4.9</span>
            <span className="stat-label">Valoración</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Descubrir</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

// ── Nosotros ──────────────────────────────────────────────────
const NosotrosSection = () => {
  const valores = [
    {
      icon: "🌿",
      title: "Raíces Andinas",
      text: "Nuestros ingredientes provienen directamente de comunidades andinas, valles costeros y selva amazónica. Trabajamos con productores locales para preservar la biodiversidad del Perú.",
    },
    {
      icon: "🌍",
      title: "Fusión con el Mundo",
      text: "El chef Alejandro Quispe fusiona técnicas de la cocina francesa, japonesa y mediterránea con la riqueza de los Andes: el resultado es una experiencia gastronómica única e irrepetible.",
    },
    {
      icon: "🏆",
      title: "Reconocimientos",
      text: "Premiados tres veces como Mejor Restaurante Peruano Contemporáneo, incluidos en la lista Latin America's 50 Best Restaurants y reconocidos por la guía Michelin en su edición latinoamericana.",
    },
  ];

  return (
    <section id="nosotros" className="section nosotros-section">
      <div className="section-container">
        <div className="nosotros-layout">
          <div className="nosotros-text">
            <span className="section-tag">Nuestra Historia</span>
            <h2 className="section-title">Un viaje por<br />los sabores del Perú</h2>
            <p className="nosotros-intro">
              Pachacamac nació en 2010 con una visión clara: elevar la cocina peruana al rango que merece en la escena gastronómica mundial, sin perder su alma ni sus raíces.
            </p>
            <p className="nosotros-body">
              Nuestro menú celebra la diversidad del Perú — desde el cebiche clásico de Lima hasta el rocoto relleno arequipeño, pasando por el juane amazónico y el cuy a la piedra cusqueño. Cada plato es un homenaje a una región, a una familia, a una tradición.
            </p>
            <p className="nosotros-body">
              La influencia de la inmigración japonesa, italiana y española que forjó el Perú moderno también vive en nuestra cocina: encontrarás tiraditos con reducción de soja, pastas rellenas de ají amarillo y arroces melosos con mariscos del Pacífico.
            </p>
            <div className="nosotros-chef">
              <div className="chef-avatar">AQ</div>
              <div>
                <strong>Chef Alejandro Quispe</strong>
                <span>Chef Ejecutivo & Co-fundador</span>
              </div>
            </div>
          </div>
          <div className="nosotros-cards">
            {valores.map((v) => (
              <div key={v.title} className="valor-card">
                <div className="valor-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Eventos ───────────────────────────────────────────────────
const EventosSection = () => {
  const [activeEvento, setActiveEvento] = useState(0);

  const eventos = [
    {
      icon: "💍",
      title: "Celebraciones & Aniversarios",
      badge: "Más solicitado",
      desc: "Convierte tu fecha especial en un recuerdo eterno. Decoración personalizada, menú degustación exclusivo de 7 tiempos, sommelier dedicado y atención impecable para ti y tus invitados.",
      includes: ["Menú 7 tiempos personalizado", "Maridaje de vinos", "Decoración floral", "Fotografía incluida", "Hasta 30 personas"],
      capacity: "Hasta 30 personas",
    },
    {
      icon: "💼",
      title: "Eventos Corporativos",
      badge: "Empresas",
      desc: "El espacio perfecto para cenas de negocio, lanzamientos de producto o reuniones de directorio. Ambiente de exclusividad, servicio discreto y gastronomía de primer nivel.",
      includes: ["Salón privado con A/V", "Menú ejecutivo", "Coffee break gourmet", "Facturación empresarial", "Coordinador asignado"],
      capacity: "Hasta 60 personas",
    },
    {
      icon: "🎂",
      title: "Cumpleaños Privados",
      badge: "Favorito",
      desc: "Celebra tu cumpleaños de una forma que nunca olvidarás. Un espacio íntimo, tu pastel diseñado a medida y un menú creado especialmente para ti y tus invitados.",
      includes: ["Salón decorado", "Pastel artesanal", "Menú a elección", "Cóctel de bienvenida", "Serenata opcional"],
      capacity: "Hasta 25 personas",
    },
    {
      icon: "🎓",
      title: "Graduaciones & Logros",
      badge: "Especial",
      desc: "El éxito merece celebrarse con elegancia. Desde graduaciones universitarias hasta ascensos laborales, organizamos una velada memorable para compartir con quienes más importan.",
      includes: ["Menú de celebración", "Brindis con champagne", "Mesa de honor decorada", "Recordatorio personalizado", "Hasta 40 personas"],
      capacity: "Hasta 40 personas",
    },
    {
      icon: "🌸",
      title: "Cenas Románticas",
      badge: "Para dos",
      desc: "Una noche solo para ustedes dos. Mesa privada con vista al jardín interior, iluminación de velas, menú degustación para dos y todos los detalles cuidados al milímetro.",
      includes: ["Mesa privada exclusiva", "Menú 5 tiempos", "Pétalos y velas", "Champagne de bienvenida", "Música en vivo opcional"],
      capacity: "2 personas",
    },
    {
      icon: "🍾",
      title: "Catas & Maridajes",
      badge: "Experiencia",
      desc: "Una experiencia sensorial guiada por nuestro sommelier: pisco peruano, vinos de la costa sur, cervezas artesanales y la cocina de fusión más creativa de la carta.",
      includes: ["6 maridajes seleccionados", "Guía sommelier", "Tabla de quesos y embutidos", "Maridaje peruano-mundial", "Hasta 15 personas"],
      capacity: "Hasta 15 personas",
    },
  ];

  const ev = eventos[activeEvento];

  return (
    <section id="servicios" className="section eventos-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Celebra con nosotros</span>
          <h2 className="section-title">Eventos Privados</h2>
          <p className="section-subtitle">
            Nuestro salón privado y jardín interior se transforman en el escenario perfecto 
            para cualquier celebración. Cada detalle, cuidado.
          </p>
        </div>

        <div className="eventos-layout">
          <div className="eventos-tabs">
            {eventos.map((e, i) => (
              <button
                key={e.title}
                className={`evento-tab ${activeEvento === i ? "active" : ""}`}
                onClick={() => setActiveEvento(i)}
              >
                <span className="tab-icon">{e.icon}</span>
                <span className="tab-label">{e.title}</span>
              </button>
            ))}
          </div>

          <div className="evento-detail">
            <div className="evento-detail-header">
              <span className="evento-badge">{ev.badge}</span>
              <h3>{ev.icon} {ev.title}</h3>
              <p>{ev.desc}</p>
            </div>
            <div className="evento-includes">
              <strong>Incluye:</strong>
              <ul>
                {ev.includes.map((item) => (
                  <li key={item}><span className="ev-check">✦</span> {item}</li>
                ))}
              </ul>
            </div>
            <div className="evento-footer">
              <span className="evento-capacity">👥 {ev.capacity}</span>
              <button className="btn-evento">Consultar Disponibilidad</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Carta ─────────────────────────────────────────────────────
const CartaSection = () => {
  const [categoria, setCategoria] = useState("entradas");

  const carta = {
    entradas: [
      { nombre: "Cebiche Clásico", origen: "Lima", precio: "S/ 52", desc: "Corvina fresca macerada en leche de tigre, cebolla morada, ají limo y choclo serrano. El sabor más puro del Perú.", fusion: false, estrella: true },
      { nombre: "Tiradito Nikkei", origen: "Fusión Perú–Japón", precio: "S/ 58", desc: "Láminas de lenguado sobre crema de ají amarillo, togarashi, sésamo tostado y reducción de miso.", fusion: true, estrella: false },
      { nombre: "Causa Limeña Trufada", origen: "Lima", precio: "S/ 46", desc: "Torre de papa amarilla con atún de aleta azul, mayonesa de limón, palta y láminas de trufa negra.", fusion: false, estrella: false },
      { nombre: "Anticucho de Pulpo", origen: "Fusión Perú–España", precio: "S/ 64", desc: "Pulpo a la brasa con salsa anticuchera de ají panca, páprika ahumada y salicornia del Mediterráneo.", fusion: true, estrella: false },
    ],
    fondos: [
      { nombre: "Lomo Saltado Wagyu", origen: "Lima", precio: "S/ 98", desc: "Corte de res wagyu A4 salteado al wok con tomate criollo, sillao, finas hierbas y papas nativas fritas.", fusion: false, estrella: true },
      { nombre: "Ají de Gallina Gourmet", origen: "Lima", precio: "S/ 72", desc: "Pechuga de gallina de campo en salsa cremosa de ají amarillo, pan brioche, nueces de macadamia y arroz negro.", fusion: false, estrella: false },
      { nombre: "Seco de Cordero Andino", origen: "Cusco / Francia", precio: "S/ 86", desc: "Costillar de cordero ayacuchano en reducción de chicha de jora, culantro fresco, frijoles y jus de borgoña.", fusion: true, estrella: false },
      { nombre: "Cuy al Horno con Miso", origen: "Fusión Perú–Japón", precio: "S/ 94", desc: "Cuy crujiente lacado con pasta de miso blanco y ají mirasol, sobre puré de camote morado y wakame.", fusion: true, estrella: false },
      { nombre: "Arroz con Leche Marino", origen: "Lima", precio: "S/ 88", desc: "Arroz arborio cocinado a la manera andina, langostinos tigre del Pacífico, vieiras y bisque de ají amarillo.", fusion: false, estrella: true },
    ],
    postres: [
      { nombre: "Suspiro a la Limeña", origen: "Lima", precio: "S/ 32", desc: "Versión clásica del postre más querido: manjar blanco de lúcuma, merengue italiano al ron y canela de Ceylán.", fusion: false, estrella: true },
      { nombre: "Tres Leches de Chirimoya", origen: "Fusión Perú–Italia", precio: "S/ 36", desc: "Bizcocho de harina de quinoa empapado en tres leches infusionadas con chirimoya, con espuma de vainilla.", fusion: true, estrella: false },
      { nombre: "Mazamorra de Maracuyá", origen: "Lima", precio: "S/ 28", desc: "Mazamorra morada reimaginada con gelatina de maracuyá, reducción de guanábana y granizado de menta.", fusion: false, estrella: false },
      { nombre: "Coulant de Cacao Chuncho", origen: "Cusco", precio: "S/ 42", desc: "Volcán de chocolate chuncho 70% del Valle del La Convención, con helado de quinua y sal de Maras.", fusion: false, estrella: true },
    ],
    bebidas: [
      { nombre: "Pisco Sour Clásico", origen: "Ica, Perú", precio: "S/ 28", desc: "Pisco quebranta, jugo de limón sutil, jarabe de goma, clara de huevo y amargo de angostura.", fusion: false, estrella: true },
      { nombre: "Chilcano de Guanábana", origen: "Lima", precio: "S/ 24", desc: "Pisco mosto verde con ginger beer artesanal, guanábana natural, pepino y jengibre fresco.", fusion: false, estrella: false },
      { nombre: "Negroni Amazónico", origen: "Fusión Perú–Italia", precio: "S/ 32", desc: "Gin infusionado con camu-camu, vermut rojo, campari y bitters de copaiba. Un clásico reimaginado.", fusion: true, estrella: false },
      { nombre: "Mocktail Andino", origen: "Perú", precio: "S/ 18", desc: "Sin alcohol. Chicha morada artesanal, maracuyá del Vraem, hierbaluisa y espuma de leche de tigre dulce.", fusion: false, estrella: false },
    ],
  };

  const categorias = [
    { key: "entradas", label: "Entradas", icon: "🥗" },
    { key: "fondos",   label: "Fondos",   icon: "🍽" },
    { key: "postres",  label: "Postres",  icon: "🍮" },
    { key: "bebidas",  label: "Bebidas",  icon: "🍷" },
  ];

  return (
    <section id="carta" className="section carta-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Nuestra propuesta</span>
          <h2 className="section-title">La Carta</h2>
          <p className="section-subtitle">
            Una selección de sabores peruanos auténticos y creaciones de fusión elaboradas con los mejores ingredientes de cada región del país.
          </p>
        </div>

        <div className="carta-legend">
          <span className="legend-item-carta"><span className="dot-fusion"></span> Fusión</span>
          <span className="legend-item-carta"><span className="dot-estrella">★</span> Firma del Chef</span>
        </div>

        <div className="carta-tabs">
          {categorias.map((c) => (
            <button
              key={c.key}
              className={`carta-tab ${categoria === c.key ? "active" : ""}`}
              onClick={() => setCategoria(c.key)}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        <div className="carta-grid">
          {carta[categoria].map((plato) => (
            <div key={plato.nombre} className={`plato-card ${plato.fusion ? "fusion" : ""} ${plato.estrella ? "estrella" : ""}`}>
              {plato.estrella && <span className="plato-estrella-badge">★ Chef</span>}
              {plato.fusion && <span className="plato-fusion-badge">Fusión</span>}
              <div className="plato-info">
                <h4 className="plato-nombre">{plato.nombre}</h4>
                <span className="plato-origen">{plato.origen}</span>
                <p className="plato-desc">{plato.desc}</p>
              </div>
              <div className="plato-precio">{plato.precio}</div>
            </div>
          ))}
        </div>

        <div className="carta-nota">
          <p>✦ Precios incluyen IGV. Menú degustación disponible previa reserva. Consulte disponibilidad por temporada.</p>
        </div>
      </div>
    </section>
  );
};

// ── Contacto ──────────────────────────────────────────────────
const ContactoSection = () => {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.asunto.trim()) e.asunto = "Requerido";
    if (!form.mensaje.trim()) e.mensaje = "Requerido";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setEnviado(true);
    setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <section id="contacto" className="section contacto-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Estamos para ti</span>
          <h2 className="section-title">Contacto & Reservas</h2>
          <p className="section-subtitle">Para reservaciones especiales, eventos privados o cualquier consulta, escríbenos.</p>
        </div>

        <div className="contacto-grid">
          <div className="contacto-form-wrapper">
            <h4>Envíanos un Mensaje</h4>
            {enviado ? (
              <div className="form-success">
                ✅ ¡Mensaje enviado! Nos pondremos en contacto contigo en menos de 24 horas.
                <button onClick={() => setEnviado(false)} className="btn-small">Enviar otro</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Nombres y Apellidos</label>
                  <input type="text" value={form.nombre} onChange={handleChange("nombre")} placeholder="Carlos Torres Rojas" />
                  {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder="miemail@mail.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Asunto</label>
                  <input type="text" value={form.asunto} onChange={handleChange("asunto")} placeholder="Reserva para evento privado" />
                  {errors.asunto && <span className="field-error">{errors.asunto}</span>}
                </div>
                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea value={form.mensaje} onChange={handleChange("mensaje")} rows={4} placeholder="Cuéntanos sobre tu evento o consulta..."></textarea>
                  {errors.mensaje && <span className="field-error">{errors.mensaje}</span>}
                </div>
                <button type="submit" className="btn-submit">Enviar Mensaje</button>
              </form>
            )}
          </div>

          <div className="contacto-info">
            <h4>Encuéntranos</h4>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="detail-icon">🏠</span>
                <div><strong>Dirección</strong><p>Av. La Mar 1050, Miraflores, Lima</p></div>
              </div>
              <div className="contact-detail-item">
                <span className="detail-icon">📞</span>
                <div><strong>Reservas</strong><p>(01) 445-3210 | 987 654 321</p></div>
              </div>
              <div className="contact-detail-item">
                <span className="detail-icon">✉️</span>
                <div><strong>Email</strong><p>reservas@pachacamac.pe</p></div>
              </div>
              <div className="contact-detail-item">
                <span className="detail-icon">🕐</span>
                <div><strong>Horario</strong><p>Mar–Dom: 12:30–15:30 / 19:30–23:00</p></div>
              </div>
            </div>
            <h4 className="mt-3">Síguenos</h4>
            <div className="social-links">
              {[
                { icon: "📸", label: "Instagram" },
                { icon: "📘", label: "Facebook" },
                { icon: "🐦", label: "Twitter" },
                { icon: "💬", label: "WhatsApp" },
                { icon: "▶️", label: "YouTube" },
              ].map((s) => (
                <a key={s.label} href="#!" className="social-btn" title={s.label}>{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Main ──────────────────────────────────────────────────────
const HomePage = () => (
  <div className="public-layout">
    <Navbar />
    <main>
      <HeroSection />
      <NosotrosSection />
      <EventosSection />
      <CartaSection />
      <ContactoSection />
    </main>
    <Footer />
  </div>
);

export default HomePage;
