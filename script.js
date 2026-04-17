// ═══════════════════════════════════════
// GOOGLE SHEETS — Web App URL
// ═══════════════════════════════════════
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHUvZaZ4RP0tJyNQvT-nWsXbwszqF4QcDxE5I8TPB_9o91NpCYv53ML0pfRuN9pNR_/exec';

// ═══════════════════════════════════════
// COUNTDOWN TIMER (15:46 → 0, then loops)
// ═══════════════════════════════════════
const TIMER_START = 15 * 60 + 46; // 946 seconds
let timerSeconds = TIMER_START;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return (m < 10 ? '0' + m : m) + ':' + (sec < 10 ? '0' + sec : sec);
}

function tickTimer() {
  timerSeconds--;
  if (timerSeconds < 0) timerSeconds = TIMER_START;
  const display = formatTime(timerSeconds);
  const t1 = document.getElementById('top-timer');
  const t2 = document.getElementById('bottom-timer');
  if (t1) t1.textContent = display;
  if (t2) t2.textContent = display;
}

setInterval(tickTimer, 1000);

// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
let mx = 0, my = 0, fx = 0, fy = 0;
if (c1 && c2) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c1.style.transform = `translate(${mx-5}px,${my-5}px)`;
  });
  (function tick(){
    fx += (mx-fx-18)*.1; fy += (my-fy-18)*.1;
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
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  navLinks.forEach(a => {
    a.parentElement.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (!menu || !btn) return;
  const isOpen = menu.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════
// SERVICE SELECTION
// ═══════════════════════════════════════
const MAX_SERVICES = 5;
const SERVICES = [
  { id: 'audit',      name: 'Бизнес Одит' },
  { id: 'meta',       name: 'Meta Ads' },
  { id: 'google',     name: 'Google Ads' },
  { id: 'branding',   name: 'Брандинг' },
  { id: 'content',    name: 'Съдържание' },
  { id: 'strategy',   name: 'Маркетинг стратегия' },
  { id: 'web',        name: 'Уеб Дизайн' },
  { id: 'leadgen',    name: 'Lead Generation' },
  { id: 'fullstack',  name: 'Full Stack' },
  { id: 'bezplaten',  name: 'Безплатен анализ' },
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

// ─── Called when clicking top bar or bottom CTA button ───
function activateFreeAnalysis() {
  // Add "bezplaten" if not already selected
  if (!selected.includes('bezplaten')) {
    if (selected.length >= MAX_SERVICES) {
      // Replace last selected with bezplaten
      selected.pop();
    }
    selected.push('bezplaten');
    renderAll();
  }
  // Scroll to contact form
  setTimeout(() => {
    const f = document.getElementById('kontakt');
    if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
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
  const container   = document.getElementById('chips-container');
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

// ═══════════════════════════════════════
// COLLECT ALL SERVICE-SPECIFIC ANSWERS
// Събира всички попълнени полета от
// динамичните секции на избраните услуги
// ═══════════════════════════════════════
function collectServiceFields() {
  const result = {};

  SERVICES.forEach(svc => {
    if (!selected.includes(svc.id)) return;

    const section = document.getElementById('fields-' + svc.id);
    if (!section) return;

    const lines = [];

    // Select dropdowns
    section.querySelectorAll('select').forEach(sel => {
      if (!sel.value) return;
      const fieldEl = sel.closest('.field');
      const label   = fieldEl ? fieldEl.querySelector('label') : null;
      lines.push((label ? label.textContent.trim() : '') + ': ' + sel.value);
    });

    // Text inputs
    section.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => {
      if (!inp.value.trim()) return;
      const fieldEl = inp.closest('.field');
      const label   = fieldEl ? fieldEl.querySelector('label') : null;
      lines.push((label ? label.textContent.trim() : '') + ': ' + inp.value.trim());
    });

    // Textareas
    section.querySelectorAll('textarea').forEach(ta => {
      if (!ta.value.trim()) return;
      const fieldEl = ta.closest('.field');
      const label   = fieldEl ? fieldEl.querySelector('label') : null;
      lines.push((label ? label.textContent.trim() : '') + ': ' + ta.value.trim());
    });

    // Checkboxes — group by field label
    const cbGroups = {};
    section.querySelectorAll('.cb-item').forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (!cb || !cb.checked) return;
      const fieldEl  = item.closest('.field');
      const groupKey = fieldEl && fieldEl.querySelector('label')
        ? fieldEl.querySelector('label').textContent.trim()
        : 'Избрано';
      if (!cbGroups[groupKey]) cbGroups[groupKey] = [];
      cbGroups[groupKey].push(item.textContent.trim());
    });
    Object.entries(cbGroups).forEach(([grp, vals]) => {
      lines.push(grp + ': ' + vals.join(', '));
    });

    if (lines.length > 0) {
      result[svc.name] = lines.join(' | ');
    }
  });

  return result;
}

// ═══════════════════════════════════════
// FORM SUBMIT → GOOGLE SHEETS
// ═══════════════════════════════════════
function resetFormState() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(el => { el.value = ''; });
    form.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });
    form.querySelectorAll('input[type="checkbox"]').forEach(el => { el.checked = false; });
  }
  selected = [];
  renderAll();
}

function setSubmitState(state) {
  const btn = document.getElementById('submit-btn');
  if (!btn) return;
  if (state === 'loading') {
    btn.disabled = true;
    btn.textContent = 'Изпращане...';
    btn.style.opacity = '0.7';
  } else {
    btn.disabled = false;
    btn.textContent = 'Изпрати запитване';
    btn.style.opacity = '';
  }
}

function showFeedback(type) {
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  if (success) success.style.display = type === 'success' ? 'flex' : 'none';
  if (error)   error.style.display   = type === 'error'   ? 'flex' : 'none';
  if (type !== 'none') {
    const el = type === 'success' ? success : error;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function showValidationError(fieldId, message) {
  clearValidationErrors();
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('field-error');
  field.focus();
  const hint = document.createElement('p');
  hint.className = 'field-validation-msg';
  hint.textContent = message;
  field.parentNode.appendChild(hint);
}

function clearValidationErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  document.querySelectorAll('.field-validation-msg').forEach(el => el.remove());
}

function submitForm() {
  showFeedback('none');

  const name    = (document.getElementById('f-name')    || {}).value || '';
  const email   = (document.getElementById('f-email')   || {}).value || '';
  const phone   = (document.getElementById('f-phone')   || {}).value || '';
  const message = (document.getElementById('f-message') || {}).value || '';

  // Chosen services
  const serviceNames = selected.map(id => {
    const svc = SERVICES.find(x => x.id === id);
    return svc ? svc.name : id;
  });
  const service = serviceNames.join(', ') || 'Не е избрана услуга';

  // Validation
  if (!name.trim())  { showValidationError('f-name',  'Моля, въведете вашето иmе.'); return; }
  if (!email.trim()) { showValidationError('f-email', 'Моля, въведете имейл адрес.'); return; }
  clearValidationErrors();

  // Collect all service-specific answers
  const svcFields = collectServiceFields();

  // "Детайли" column — всички отговори обединени
  const detailParts = Object.entries(svcFields).map(
    ([svcName, answers]) => '[' + svcName + '] ' + answers
  );
  const details = detailParts.join(' || ');

  // Build payload
  const payload = {
    name:        name.trim(),
    email:       email.trim(),
    phone:       phone.trim(),
    service:     service,
    message:     message.trim(),
    details:     details,
    submittedAt: new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }),
    source:      'themarketingclinic.bg'
  };

  // Add each service as its own flat column
  Object.entries(svcFields).forEach(([svcName, answers]) => {
    const key = svcName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    payload[key] = answers;
  });

  setSubmitState('loading');

  fetch(GOOGLE_SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
    mode:    'no-cors'
  })
  .then(() => {
    setSubmitState('idle');
    showFeedback('success');
    resetFormState();
  })
  .catch(() => {
    setSubmitState('idle');
    showFeedback('error');
  });
}


// ═══════════════════════════════════════
// DYNAMIC ANNOUNCEMENT BAR OFFSET
// Adjusts nav and hero based on actual bar height
// ═══════════════════════════════════════
function adjustForAnnounceBar() {
  const bar = document.getElementById('announce-bar');
  const nav = document.querySelector('nav');
  const hero = document.querySelector('.hero');
  if (!bar || !nav) return;

  const barH = bar.offsetHeight;
  nav.style.top = barH + 'px';

  if (hero) {
    const navH = nav.offsetHeight;
    hero.style.paddingTop = (barH + navH + 16) + 'px';
  }
}

// Run on load and on resize
window.addEventListener('load', adjustForAnnounceBar);
window.addEventListener('resize', adjustForAnnounceBar);
// Also run after fonts load (can change bar height)
document.fonts && document.fonts.ready.then(adjustForAnnounceBar);

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => { renderAll(); });
