// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
let mx = 0, my = 0, fx = 0, fy = 0;
if (c1 && c2) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c1.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
  });
  (function tick() {
    fx += (mx - fx - 18) * .1;
    fy += (my - fy - 18) * .1;
    c2.style.transform = `translate(${fx}px,${fy}px)`;
    requestAnimationFrame(tick);
  })();
}

// ═══════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ═══════════════════════════════════════
// ACTIVE NAV
// ═══════════════════════════════════════
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.parentElement.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (!menu || !btn) return;
  const isOpen = menu.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════
// SERVICE SELECTION STATE
// ═══════════════════════════════════════
const MAX_SERVICES = 5;
const SERVICES = [
  { id: 'audit',     name: 'Бизнес Одит' },
  { id: 'meta',      name: 'Meta Ads' },
  { id: 'google',    name: 'Google Ads' },
  { id: 'branding',  name: 'Брандинг' },
  { id: 'content',   name: 'Съдържание' },
  { id: 'strategy',  name: 'Маркетинг стратегия' },
  { id: 'web',       name: 'Уеб Дизайн' },
  { id: 'leadgen',   name: 'Lead Generation' },
  { id: 'fullstack', name: 'Full Stack' },
];
let selected = [];

function toggleService(id) {
  const idx = selected.indexOf(id);
  if (idx > -1) {
    selected.splice(idx, 1);
    renderAll();
  } else {
    if (selected.length >= MAX_SERVICES) { flashLimitHint(); return; }
    selected.push(id);
    renderAll();
    setTimeout(() => {
      const f = document.getElementById('kontakt');
      if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

function removeService(id) {
  const idx = selected.indexOf(id);
  if (idx > -1) { selected.splice(idx, 1); renderAll(); }
}

function renderAll() {
  renderCards();
  renderChips();
  renderPickerButtons();
  renderServiceFields();
}

function renderCards() {
  SERVICES.forEach(s => {
    const card = document.querySelector('[data-service="' + s.id + '"]');
    if (card) card.classList.toggle('svc-selected', selected.includes(s.id));
  });
}

function renderChips() {
  const container = document.getElementById('chips-container');
  const placeholder = document.getElementById('chips-placeholder');
  if (!container) return;
  container.innerHTML = '';
  selected.forEach(id => {
    const svc = SERVICES.find(x => x.id === id);
    if (!svc) return;
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = '<span>' + svc.name + '</span><button class="chip-remove" type="button" onclick="removeService(\'' + id + '\')" aria-label="Премахни">&times;</button>';
    container.appendChild(chip);
  });
  if (placeholder) placeholder.style.display = selected.length === 0 ? 'block' : 'none';
  const hint = document.getElementById('limit-hint');
  if (hint) hint.classList.toggle('show', selected.length >= MAX_SERVICES);
}

function renderPickerButtons() {
  document.querySelectorAll('.pick-btn').forEach(btn => {
    const id = btn.getAttribute('data-pick');
    if (id) btn.classList.toggle('active', selected.includes(id));
  });
}

function renderServiceFields() {
  SERVICES.forEach(s => {
    const el = document.getElementById('fields-' + s.id);
    if (el) el.classList.toggle('show', selected.includes(s.id));
  });
  const noSel = document.getElementById('fields-none');
  if (noSel) noSel.classList.toggle('show', selected.length === 0);
}

function flashLimitHint() {
  const hint = document.getElementById('limit-hint');
  if (!hint) return;
  hint.classList.add('show');
  hint.classList.remove('pulse');
  void hint.offsetWidth;
  hint.classList.add('pulse');
  setTimeout(() => hint.classList.remove('pulse'), 1100);
}

document.addEventListener('DOMContentLoaded', () => { renderAll(); });