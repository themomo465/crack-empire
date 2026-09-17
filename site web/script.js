/* ===========================
   CRACK EMPIRE — JS
=========================== */

// ── PARTICLES ──────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  const colors = ['#ff2244', '#cc1133', '#ff6666', '#ff4455', '#ff8800'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-delay:${Math.random()*15}s;
      animation-duration:${Math.random()*10+8}s;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      opacity:${Math.random()*0.5+0.2};
    `;
    container.appendChild(p);
  }
})();

// ── CARD ENTRANCE ANIMATION ─────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(0.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
`;
document.head.appendChild(styleEl);

// ── NAV ACTIVE ON SCROLL ───────────────────
window.addEventListener('scroll', () => {
  const sections = ['games', 'tools', 'about'];
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  links.forEach(link => link.classList.toggle('active', link.dataset.section === current));
});

// ── MOBILE MENU ─────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

// ── SMOOTH SCROLL ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ══════════════════════════════════════════
//   SEARCH + FILTER — logique centrale
// ══════════════════════════════════════════
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const filterBtns    = document.querySelectorAll('.filter-btn');
const gameCards     = document.querySelectorAll('.game-card');
const noResults     = document.getElementById('noResults');
const noResultsQ    = document.getElementById('noResultsQuery');

let activeFilter = 'all';
let activeQuery  = '';

/**
 * Applique filtre de catégorie ET recherche textuelle en même temps.
 * Un jeu est visible si :
 *   - sa catégorie correspond au filtre actif (ou filtre = "all")
 *   - ET son data-name contient le texte tapé (recherche floue)
 */
function applyFilters() {
  const q = activeQuery.toLowerCase().trim();
  let visible = 0;

  gameCards.forEach(card => {
    const cat      = card.dataset.category || '';
    const name     = (card.dataset.name || '').toLowerCase();
    const title    = (card.querySelector('h3')?.textContent || '').toLowerCase();

    const matchCat  = activeFilter === 'all' || cat === activeFilter;
    const matchText = q === '' || name.includes(q) || title.includes(q);

    const show = matchCat && matchText;
    card.classList.toggle('hidden', !show);

    if (show) {
      visible++;
      // mini animation à chaque apparition
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = 'cardIn 0.35s ease forwards';
    }
  });

  // Message "aucun résultat"
  if (visible === 0 && q !== '') {
    noResultsQ.textContent = q;
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }
}

// Recherche — live au fil de la frappe
searchInput.addEventListener('input', () => {
  activeQuery = searchInput.value;
  searchClear.classList.toggle('visible', activeQuery.length > 0);
  applyFilters();
});

// Bouton effacer
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  activeQuery = '';
  searchClear.classList.remove('visible');
  searchInput.focus();
  applyFilters();
});

// Touche Échap pour effacer
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') searchClear.click();
});

// Filtres par catégorie
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Bouton Jeux Gratuits → modal maintenance
    if (btn.dataset.filter === 'gratuit') {
      openMaintenanceModal();
      return;
    }
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

// ── MODAL MAINTENANCE ────────────────────────
let maintInterval = null;

function openMaintenanceModal() {
  document.getElementById('maintenanceModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Barre de progression animée
  const fill = document.querySelector('.maint-bar-fill');
  const pct  = document.getElementById('maintPct');
  let val = 0;
  clearInterval(maintInterval);
  fill.style.width = '0%';
  pct.textContent = '0%';

  maintInterval = setInterval(() => {
    // Avance aléatoirement et se bloque avant 100
    const step = Math.random() * 4 + 0.5;
    val = Math.min(val + step, 73); // bloqué à 73% pour l'effet "en cours"
    fill.style.width = val + '%';
    pct.textContent = Math.floor(val) + '%';
  }, 120);
}

function closeMaintenanceModal() {
  document.getElementById('maintenanceModal').classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(maintInterval);
}

document.getElementById('maintenanceModal').addEventListener('click', function(e) {
  if (e.target === this) closeMaintenanceModal();
});

// ── MODAL PAIEMENT ───────────────────────────function openPayModal(gameName, price) {
  document.getElementById('modalGameName').textContent = gameName;
  document.getElementById('modalGamePrice').textContent = price;
  document.getElementById('payModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePayModal() {
  document.getElementById('payModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('payModal').addEventListener('click', function(e) {
  if (e.target === this) closePayModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePayModal(); closeMaintenanceModal(); }
});

// ── CARD HOVER MOUSE GLOW ────────────────────
gameCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${((e.clientY - r.top)  / r.height) * 100}%`);
  });
});

// ── CONSOLE BRANDING ─────────────────────────
console.log('%c👑 Crack Empire', 'color:#ff2244;font-size:20px;font-weight:bold;font-family:monospace;');
console.log('%cPowered by vibes & cracks 🎮', 'color:#cc1133;font-size:12px;font-family:monospace;');
