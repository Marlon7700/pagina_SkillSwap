/* ==================== CHROME TABS LOGIC ==================== */
function switchTab(tabId) {
  // 1. Update active tab UI
  document.querySelectorAll('.chrome-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
  });

  // 2. Hide all panels
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => {
    p.classList.remove('active', 'show');
  });

  // 3. Show target panel with animation
  const activePanel = document.getElementById('panel-' + tabId);
  if (activePanel) {
    activePanel.classList.add('active');
    // Force reflow for transform transition
    void activePanel.offsetWidth;
    activePanel.classList.add('show');
    
    // 4. Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. Trigger reveal animations for this panel
    const reveals = activePanel.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals.forEach(el => {
      revealObserver.unobserve(el);
      revealObserver.observe(el);
    });

    // 6. Special handling for certain tabs
    if (tabId === 'home') {
      // Re-trigger counters if home
      const stats = activePanel.querySelector('.hero-stats');
      if (stats) counterObserver.observe(stats);
    }
  }
}

// Ensure first tab is loaded correctly on boot
document.addEventListener('DOMContentLoaded', () => {
    switchTab('home');
});

/* ==================== DATA ==================== */
const screensData = [
  { cat: 'autenticacion', title: '1. Splash Screen', desc: 'Pantalla de bienvenida con logo', icon: 'fa-solid fa-mobile-screen-button' },
  { cat: 'autenticacion', title: '2. Login', desc: 'Acceso con email y Google', icon: 'fa-solid fa-right-to-bracket' },
  { cat: 'autenticacion', title: '3. Recuperar Contraseña', desc: 'Restablecimiento seguro', icon: 'fa-solid fa-key' },
  { cat: 'autenticacion', title: '4. Sign Up', desc: 'Registro de nuevos usuarios', icon: 'fa-solid fa-user-plus' },
  { cat: 'onboarding', title: '5. Bienvenida Paso 1', desc: 'Selección de idioma nativo', icon: 'fa-solid fa-language' },
  { cat: 'onboarding', title: '6. Onboarding Paso 2', desc: 'Conocimientos a compartir', icon: 'fa-solid fa-share-nodes' },
  { cat: 'onboarding', title: '7. Selección de Especialidad', desc: 'Buscador de áreas categorizadas', icon: 'fa-solid fa-magnifying-glass' },
  { cat: 'onboarding', title: '8. Galería de Subáreas', desc: 'Habilidades específicas', icon: 'fa-solid fa-grip' },
  { cat: 'onboarding', title: '9. Avatar de Perfil', desc: 'Personalización de imagen', icon: 'fa-solid fa-circle-user' },
  { cat: 'onboarding', title: '10. Visualización de Áreas', desc: 'Resumen gráfico de habilidades', icon: 'fa-solid fa-chart-pie' },
  { cat: 'interacciones', title: '11. Chat Principal', desc: 'Listado de conversaciones activas', icon: 'fa-solid fa-comments' },
  { cat: 'interacciones', title: '12. Conversación de Texto', desc: 'Chat fluido instantáneo', icon: 'fa-solid fa-message' },
  { cat: 'interacciones', title: '13. Burbujas de Audio', desc: 'Notas de voz interactivas', icon: 'fa-solid fa-microphone' },
  { cat: 'interacciones', title: '14. Envío de Archivos', desc: 'Compartir archivos y manuales', icon: 'fa-solid fa-file-arrow-up' },
  { cat: 'interacciones', title: '15. Envío de Imágenes', desc: 'Compresión inteligente Base64', icon: 'fa-solid fa-image' },
  { cat: 'interacciones', title: '16. Menú de Mensajes', desc: 'Editar, borrar y responder', icon: 'fa-solid fa-ellipsis' },
  { cat: 'interacciones', title: '17. Personalización de Chat', desc: 'Color e imagen de fondo', icon: 'fa-solid fa-palette' },
  { cat: 'interacciones', title: '18. Asistente IA', desc: 'Chatbot inteligente de SkillSwap', icon: 'fa-solid fa-robot' },
  { cat: 'interacciones', title: '19. Sugerencias Gemini', desc: 'Sugerencias educativas con IA', icon: 'fa-solid fa-wand-magic-sparkles' },
  { cat: 'interacciones', title: '20. Generación de Imágenes IA', desc: 'Ilustraciones desde prompts', icon: 'fa-solid fa-paintbrush' },
  { cat: 'interacciones', title: '21. Visualizador Adjuntos IA', desc: 'Análisis de archivos por IA', icon: 'fa-solid fa-paperclip' },
  { cat: 'interacciones', title: '22. Historial Conversaciones IA', desc: 'Chats anteriores de IA', icon: 'fa-solid fa-clock-rotate-left' },
  { cat: 'sistema', title: '23. Buscador Global', desc: 'Filtro unificado por materia', icon: 'fa-solid fa-search' },
  { cat: 'sistema', title: '24. Sugerencias de Matches', desc: 'Perfiles compatibles recomendados', icon: 'fa-solid fa-users' },
  { cat: 'sistema', title: '25. Solicitud de Match', desc: 'Envío de Match / Flash on', icon: 'fa-solid fa-bolt' },
  { cat: 'sistema', title: '26. Solicitud Pendiente', desc: 'Estado de solicitud enviada', icon: 'fa-solid fa-hourglass-half' },
  { cat: 'sistema', title: '27. Match Aceptado', desc: 'Animación de match mutuo', icon: 'fa-solid fa-check-double' },
  { cat: 'sistema', title: '28. Calificaciones', desc: 'Reseñas por nivel de explicación', icon: 'fa-solid fa-star' },
  { cat: 'sistema', title: '29. Tutores Favoritos', desc: 'Favoritos con acceso directo', icon: 'fa-solid fa-heart' },
  { cat: 'sistema', title: '30. Mis Archivos', desc: 'Gestor de carpetas y archivos', icon: 'fa-solid fa-folder-open' },
  { cat: 'sistema', title: '31. Visor de PDF', desc: 'Visualización de manuales adjuntos', icon: 'fa-solid fa-file-pdf' },
  { cat: 'sistema', title: '32. Aviso de Privacidad', desc: 'Compromiso legal de SkillSwap', icon: 'fa-solid fa-shield-check' },
  { cat: 'sistema', title: '33. Configuración', desc: 'Ajustes generales de la cuenta', icon: 'fa-solid fa-gear' },
  { cat: 'calendario', title: '34. Programación de Hora', desc: 'Selector de hora para agendar encuentros', icon: 'fa-solid fa-clock' },
  { cat: 'calendario', title: '35. Programación de Calendario', desc: 'Vista de calendario para organizar encuentros', icon: 'fa-solid fa-calendar-days' },
  { cat: 'calendario', title: '36. Selección de Fecha', desc: 'Elección precisa del día del encuentro', icon: 'fa-solid fa-calendar-check' }
];

const catColors = {
  autenticacion: '#6BCE7A', onboarding: '#00A99D',
  interacciones: '#60a5fa', sistema: '#a855f7', calendario: '#f59e0b'
};

// Cargar las imágenes de la carpeta IMAGENES por defecto
let imageStore = [
  ...Array.from({ length: 33 }, (_, i) => `IMAGENES/${i + 1}.jpg`),
  'IMAGENES/34-1.jpg',
  'IMAGENES/34-2.jpg',
  'IMAGENES/34.jpg'
];
let currentSlide = 0;
const SLIDES_IN_PHONE = 5; // show first N in phone nav

/* ==================== PARTICLES ==================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(107,206,122,${p.alpha})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==================== TYPEWRITER ==================== */
const phrases = ['Comparte Habilidades', 'Aprende sin Límites', 'Crece con Otros', 'Conecta al Mundo'];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');
const cursorEl = document.getElementById('typedCursor');

function typeLoop() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = phrase.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 90);
}
// Cursor blink
setInterval(() => { cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0'; }, 500);

/* ==================== NAVBAR SCROLL ==================== */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ==================== COUNTERS ==================== */
function animateCounter(id, end, suffix, duration = 1500) {
  const el = document.getElementById(id);
  let start = 0, step = end / (duration / 16);
  const interval = setInterval(() => {
    start = Math.min(start + step, end);
    el.textContent = Math.round(start);
    if (start >= end) clearInterval(interval);
  }, 16);
}

/* ==================== SCROLL REVEAL ==================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Counter trigger
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounter('counter1', 33);
    animateCounter('counter2', 100);
    animateCounter('counter3', 3);
    counterObserver.disconnect();
  }
}, { threshold: 0.5 });
counterObserver.observe(document.querySelector('.hero-stats'));

/* ==================== PHONE CAROUSEL ==================== */
function buildPhoneSlides() {
  const screen = document.getElementById('phoneScreen');
  const dots = document.getElementById('phoneDots');
  screen.innerHTML = '';
  dots.innerHTML = '';

  screensData.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');
    slide.id = 'slide-' + i;

    if (imageStore[i]) {
      slide.innerHTML = `<img src="${imageStore[i]}" alt="${s.title}">`;
    } else {
      slide.innerHTML = `
        <div class="slide-placeholder">
          <div class="ph-icon"><i class="${s.icon}"></i></div>
          <h6>${s.title}</h6>
          <p>${s.desc}</p>
        </div>`;
    }
    screen.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'phone-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    // only show first 7 dots max
    if (i < 7) dots.appendChild(dot);
  });

  updateScreenLabel();
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.phone-dot');
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add('exit');
  setTimeout(() => slides[currentSlide].classList.remove('exit'), 500);

  currentSlide = (idx + screensData.length) % screensData.length;
  slides[currentSlide].classList.add('active');

  dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(currentSlide, 6)));
  updateScreenLabel();
}

function changeSlide(dir) { goToSlide(currentSlide + dir); }

function updateScreenLabel() {
  const label = document.getElementById('screenLabel');
  const s = screensData[currentSlide];
  label.innerHTML = `<strong>${s.title}</strong> — ${s.cat}`;
}

// Auto-advance phone
setInterval(() => changeSlide(1), 4000);

/* ==================== GALLERY ==================== */
function renderGallery(filter = 'todos') {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  screensData.forEach((s, i) => {
    if (filter !== 'todos' && s.cat !== filter) return;
    const img = imageStore[i]
      ? `<img src="${imageStore[i]}" alt="${s.title}">`
      : `<div class="gal-placeholder-icon"><i class="${s.icon}"></i></div>`;
    const card = document.createElement('div');
    card.className = 'col-sm-6 col-md-4 col-lg-3 gal-phone-container reveal';
    card.innerHTML = `
      <div class="gal-card" onclick="openLightbox(${i})" role="button" tabindex="0" onkeydown="if(event.key==='Enter')this.click()" aria-label="Ver pantalla: ${s.title}">
        <span class="gal-cat-badge">${s.cat}</span>
        <div class="gal-img-wrap">
          ${img}
        </div>
      </div>
      <div class="gal-info">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`;
    grid.appendChild(card);
    setTimeout(() => revealObserver.observe(card), 10);
  });
}

function filterGal(cat, btn) {
  document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(cat);
}

/* ==================== 360 PHONE ROTATION ==================== */
const phoneWrapper = document.getElementById('phoneWrapper');
let isDragging = false;
let startX = 0;
let currentRotationY = -8; // initial state
let lastRotationY = -8;

phoneWrapper.addEventListener('mousedown', startDrag);
phoneWrapper.addEventListener('touchstart', startDrag, { passive: true });

window.addEventListener('mousemove', doDrag);
window.addEventListener('touchmove', doDrag, { passive: false });

window.addEventListener('mouseup', stopDrag);
window.addEventListener('touchend', stopDrag);

function startDrag(e) {
  isDragging = true;
  startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  phoneWrapper.style.transition = 'none';
  // disable float animation if it exists or use a container
}

function doDrag(e) {
  if (!isDragging) return;
  const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const deltaX = x - startX;
  currentRotationY = lastRotationY + (deltaX * 0.5);
  phoneWrapper.style.transform = `rotateY(${currentRotationY}deg) rotateX(2deg)`;
  
  if (e.cancelable) e.preventDefault();
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  lastRotationY = currentRotationY;
  phoneWrapper.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
}

// Re-add a slight float effect but with manual override
function applySubtleFloat() {
  if (isDragging) return;
  // We can let the user's manual rotation persist
}

/* ==================== LIGHTBOX ==================== */
function openLightbox(idx) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (imageStore[idx]) {
    img.src = imageStore[idx];
    lb.classList.add('open');
  } else {
    showToast('Sin imagen aún', `Sube la imagen "${screensData[idx].title}" primero`, 'fa-solid fa-circle-info');
  }
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ==================== RATING ==================== */
const ratings = { app: 0, page: 0 };
const labels = {
  1: '😞 Muy mala', 2: '😐 Regular',
  3: '🙂 Buena', 4: '😃 Muy buena', 5: '🤩 ¡Excelente!'
};
const reviews = [];

function setRating(type, val) {
  ratings[type] = val;
  const stars = document.querySelectorAll(`#${type}Stars .star`);
  stars.forEach((s, i) => s.classList.toggle('lit', i < val));
  document.getElementById(`${type}RatingLabel`).textContent = labels[val] || '';
}
function hoverRating(type, val) {
  document.querySelectorAll(`#${type}Stars .star`).forEach((s, i) => {
    s.classList.toggle('hover', i < val);
  });
}
function unhoverRating(type) {
  document.querySelectorAll(`#${type}Stars .star`).forEach(s => s.classList.remove('hover'));
}

function submitReview() {
  if (!ratings.app && !ratings.page) {
    showToast('Calificación requerida', 'Por favor selecciona al menos una estrella', 'fa-solid fa-triangle-exclamation');
    return;
  }
  const text = document.getElementById('reviewText').value.trim();
  const name = document.getElementById('reviewName').value.trim() || 'Anónimo';
  const avg = ((ratings.app || 0) + (ratings.page || 0)) / (ratings.app && ratings.page ? 2 : 1);

  reviews.unshift({ name, text, app: ratings.app, page: ratings.page, avg });
  updateAvgScore();
  renderReviews();

  document.getElementById('reviewText').value = '';
  document.getElementById('reviewName').value = '';
  setRating('app', 0); setRating('page', 0);
  document.getElementById('appRatingLabel').textContent = '— Selecciona una calificación';
  document.getElementById('pageRatingLabel').textContent = '— Selecciona una calificación';
  document.querySelectorAll('.star').forEach(s => s.classList.remove('lit'));

  showToast('¡Gracias!', 'Tu reseña fue publicada con éxito', 'fa-solid fa-heart');
}

function updateAvgScore() {
  if (!reviews.length) return;
  const avg = reviews.reduce((a, r) => a + r.avg, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;
  document.getElementById('avgScore').textContent = rounded;
  document.getElementById('avgStars').innerHTML = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
  document.getElementById('reviewCount').textContent = `${reviews.length} reseña${reviews.length > 1 ? 's' : ''}`;
}

function renderReviews() {
  const list = document.getElementById('reviewsList');
  list.innerHTML = reviews.slice(0, 6).map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(Math.round(r.avg))}${'☆'.repeat(5 - Math.round(r.avg))}</div>
      ${r.text ? `<div class="review-text">"${r.text}"</div>` : ''}
      <div class="review-author">— ${r.name}${r.app ? ` · App: ${r.app}★` : ''}${r.page ? ` · Page: ${r.page}★` : ''}</div>
    </div>`).join('');
}

/* ==================== TOAST ==================== */
let toastTimer;
function showToast(msg, sub, icon = 'fa-solid fa-circle-check') {
  clearTimeout(toastTimer);
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastSub').textContent = sub || '';
  document.querySelector('.toast-icon i').className = icon;
  const t = document.getElementById('toast');
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ==================== DOWNLOAD CONFIRMATION ==================== */
let pendingDownloadHref = '';
const downloadModal = document.getElementById('downloadModal');
const downloadTermsCheck = document.getElementById('downloadTermsCheck');
const downloadModalClose = document.getElementById('downloadModalClose');
const downloadCancelBtn = document.getElementById('downloadCancelBtn');
const downloadConfirmBtn = document.getElementById('downloadConfirmBtn');

function openDownloadModal(href) {
  pendingDownloadHref = href;
  downloadTermsCheck.checked = false;
  downloadModal.classList.add('open');
  downloadModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => downloadTermsCheck.focus(), 50);
}

function closeDownloadModal() {
  downloadModal.classList.remove('open');
  downloadModal.setAttribute('aria-hidden', 'true');
  pendingDownloadHref = '';
}

function startApkDownload(href) {
  const link = document.createElement('a');
  link.href = href;
  link.download = 'SkillSwap.apk';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-apk-download]');
  if (!trigger) return;
  event.preventDefault();
  openDownloadModal(trigger.getAttribute('href'));
});

downloadModal.addEventListener('click', (event) => {
  if (event.target === downloadModal) closeDownloadModal();
});

downloadModalClose.addEventListener('click', closeDownloadModal);
downloadCancelBtn.addEventListener('click', closeDownloadModal);

downloadConfirmBtn.addEventListener('click', () => {
  if (!downloadTermsCheck.checked) {
    showToast('Acepta los términos y condiciones', 'Marca la casilla para continuar con la descarga', 'fa-solid fa-triangle-exclamation');
    return;
  }

  if (pendingDownloadHref) {
    const href = pendingDownloadHref;
    closeDownloadModal();
    startApkDownload(href);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && downloadModal.classList.contains('open')) {
    closeDownloadModal();
  }
});

/* ==================== 3D TILT CARDS ==================== */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ==================== INIT ==================== */
window.addEventListener('DOMContentLoaded', () => {
  buildPhoneSlides();
  renderGallery();
  typeLoop();
  
  // Professional 360 Intro
  setTimeout(() => {
    phoneWrapper.style.transition = 'transform 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    phoneWrapper.style.transform = 'rotateY(352deg) rotateX(2deg)';
    lastRotationY = 352;
    currentRotationY = 352;
  }, 1000);
});