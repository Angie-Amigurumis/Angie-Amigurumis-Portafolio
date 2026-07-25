/* =========================================================
   CONFIGURACIÓN — EDITA ESTOS VALORES
   ========================================================= */
const AIRTABLE_TOKEN = 'TU_PERSONAL_ACCESS_TOKEN_AQUI';
const AIRTABLE_BASE_ID = 'TU_BASE_ID_AQUI';
const AIRTABLE_TABLE_NAME = 'Productos';

const WHATSAPP_NUMBER = '0000000000'; // Ej: 5215512345678

/* Imágenes del carrusel destacado (tú las pones aquí) */
const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=750&fit=crop'
];

/* =========================================================
   NO TOCAR NADA DEBAJO
   ========================================================= */

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
const GRID_MAP = { '1': 'grid-mini', '2': 'grid-clasico', '3': 'grid-premium' };
const CAT_NAMES = { '1': 'Mini', '2': 'Clásico', '3': 'Premium' };
const CAT_COLORS = { '1': 'var(--pink-deep)', '2': 'var(--blue-deep)', '3': 'var(--green-deep)' };

/* ---------- UTILS ---------- */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function placeholderSVG(label) {
  return `<div class="ph-slot" style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--ink-soft);">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" style="width:28px;height:28px;opacity:0.5;">
      <rect x="3" y="5" width="18" height="14" rx="1"/>
      <circle cx="8.5" cy="10" r="1.3"/>
      <path d="M21 15l-5-5-4 4-3-3-6 6"/>
    </svg>
    <span style="font-size:0.7rem;letter-spacing:0.06em;text-transform:uppercase;font-weight:800;">${escapeHtml(label)}</span>
  </div>`;
}

/* ---------- SKELETON ---------- */
function renderSkeletons() {
  const count = window.innerWidth < 640 ? 3 : 4;
  Object.values(GRID_MAP).forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      grid.appendChild(sk);
    }
  });
}

/* ---------- CARRUSEL ---------- */
function initCarousel() {
  const carousel = document.getElementById('carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!carousel || CAROUSEL_IMAGES.length === 0) return;

  carousel.innerHTML = CAROUSEL_IMAGES.map(url =>
    `<div class="carousel-item"><img src="${url}" alt="Destacado" loading="lazy"></div>`
  ).join('');

  dotsContainer.innerHTML = CAROUSEL_IMAGES.map((_, i) =>
    `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
  ).join('');

  let current = 0;
  const dots = dotsContainer.querySelectorAll('.dot');
  const items = carousel.querySelectorAll('.carousel-item');

  function goTo(index) {
    current = index;
    const item = items[index];
    if (item) {
      const scrollLeft = item.offsetLeft - carousel.offsetLeft - (carousel.clientWidth - item.clientWidth) / 2;
      carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  document.getElementById('carousel-prev')?.addEventListener('click', () => {
    goTo((current - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  });
  document.getElementById('carousel-next')?.addEventListener('click', () => {
    goTo((current + 1) % CAROUSEL_IMAGES.length);
  });

  setInterval(() => goTo((current + 1) % CAROUSEL_IMAGES.length), 4500);

  let startX = 0;
  carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? goTo((current + 1) % CAROUSEL_IMAGES.length)
        : goTo((current - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    }
  }, { passive: true });

  carousel.addEventListener('scroll', () => {
    const scrollCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      if (Math.abs(scrollCenter - itemCenter) < item.clientWidth / 2) {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[i]) dots[i].classList.add('active');
        current = i;
      }
    });
  }, { passive: true });
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('menuClose');
  const menu = document.getElementById('mobileMenu');
  if (toggle) toggle.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  document.querySelectorAll('.menu-link').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
}

/* ---------- PRODUCT CARD ---------- */
function createProductCard(product) {
  const f = product.fields;
  const name = f.Nombre || 'Sin nombre';
  const price = f.Precio ? `$${Number(f.Precio).toLocaleString('es-MX')}` : 'Cotizar';

  let imageUrl = '';
  if (f.Imagen && f.Imagen.length > 0) imageUrl = f.Imagen[0].url;

  const card = document.createElement('div');
  card.className = 'lux-card';
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ver ${name}`);

  const media = imageUrl
    ? `<img src="${imageUrl}" alt="${escapeHtml(name)}" loading="lazy">`
    : placeholderSVG(name);

  card.innerHTML = `
    <div class="lux-front">
      ${media}
      <div class="card-price-tag">${price}</div>
      <div class="card-expand">↗</div>
    </div>
  `;

  card.addEventListener('click', () => openModal(product));
  return card;
}

/* ---------- MODAL ---------- */
function openModal(product) {
  const f = product.fields;
  const name = f.Nombre || 'Sin nombre';
  const desc = f.Descripcion || f.Descripción || 'Sin descripción disponible.';
  const price = f.Precio ? `$${Number(f.Precio).toLocaleString('es-MX')} MXN` : 'Cotizar';
  const cat = String(f.Categoria);

  let imageUrl = '';
  if (f.Imagen && f.Imagen.length > 0) imageUrl = f.Imagen[0].url;

  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-img').src = imageUrl || '';
  document.getElementById('modal-img').alt = name;

  const catEl = document.getElementById('modal-category');
  catEl.textContent = CAT_NAMES[cat] || '';
  catEl.style.color = CAT_COLORS[cat] || 'var(--ink-soft)';

  document.getElementById('modal-name').textContent = name;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal-desc').textContent = desc;

  const waText = encodeURIComponent(`Hola, me interesa la pieza "${name}" (${price}) que vi en tu portafolio.`);
  document.getElementById('modal-cta').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ---------- FETCH & RENDER ---------- */
async function fetchProducts() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    renderProducts(data.records);
  } catch (error) {
    console.error(error);
    showError('No se pudieron cargar los productos. Revisa tu configuración de Airtable.');
  }
}

function renderProducts(records) {
  Object.values(GRID_MAP).forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (grid) grid.innerHTML = '';
  });

  const grouped = { '1': [], '2': [], '3': [] };
  records.forEach(r => {
    const cat = String(r.fields.Categoria);
    if (grouped[cat]) grouped[cat].push(r);
  });

  Object.entries(grouped).forEach(([cat, products]) => {
    const grid = document.getElementById(GRID_MAP[cat]);
    if (!grid) return;
    if (products.length === 0) {
      grid.innerHTML = '<div class="empty-grid">No hay productos aún.</div>';
      return;
    }
    products.forEach(p => grid.appendChild(createProductCard(p)));
  });
}

function showError(msg) {
  Object.values(GRID_MAP).forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (grid) grid.innerHTML = `<div class="empty-grid">${escapeHtml(msg)}</div>`;
  });
}

/* ---------- FOOTER ---------- */
function initFooter() {
  const link = document.getElementById('wa-footer');
  if (link && WHATSAPP_NUMBER !== '0000000000') {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderSkeletons();
  initCarousel();
  initMobileMenu();
  initModal();
  initFooter();
  fetchProducts();
});
