/* NANHER HEW 文 — SCRIPT */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lock = (v) => (document.body.style.overflow = v ? 'hidden' : '');

/* ---------- 18+ GATE ---------- */
const ageGate = $('#ageGate');
if (sessionStorage.getItem('nanherAgeVerified') === 'true') ageGate.classList.add('hidden');
else lock(true);
$('#ageEnter').onclick = () => {
  sessionStorage.setItem('nanherAgeVerified', 'true');
  ageGate.classList.add('hidden');
  lock(false);
};
$('#ageLeave').onclick = () => (location.href = 'https://www.google.com');

/* ---------- ARCHIVE (data-driven) ---------- */
const ARCHIVE = [
  { src: '05', tab: 'characters', label: 'CHARACTER / 01' },
  { src: '06', tab: 'characters', label: 'CHARACTER / 02' },
  { src: '07', tab: 'bara', label: 'BARA / 01' },
  { src: '08', tab: 'bara', label: 'BARA / 02' },
  { src: '02', tab: 'commissions', label: 'COMMISSION / 01 — FOR @BJOERN90' },
  { src: '03', tab: 'commissions', label: 'COMMISSION / 02 — FOR @OUTDOOWPUMPKIN9' },
  { src: 'wip01', tab: 'wips', label: 'WIP / 01' },
  { src: 'wip02', tab: 'wips', label: 'WIP / 02' }
];
const grid = $('#archiveGrid');
function renderArchive(tab = 'all') {
  const items = tab === 'all' ? ARCHIVE : ARCHIVE.filter(i => i.tab === tab);
  grid.innerHTML = items.map(i =>
    `<div class="art-card"><img src="arts/${i.src}.jpg" alt="${i.label}" loading="lazy"><span>${i.label}</span></div>`
  ).join('');
}
renderArchive();
$$('#archiveTabs .tab').forEach(btn => btn.onclick = () => {
  $$('#archiveTabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderArchive(btn.dataset.tab);
});

/* ---------- LIGHTBOX (delegated) ---------- */
const lightbox = $('#lightbox'), lbContent = $('#lightboxContent');
document.addEventListener('click', e => {
  const card = e.target.closest('.art-card');
  if (!card) return;
  const img = card.querySelector('img');
  if (!img) return;
  lbContent.innerHTML = '';
  const full = document.createElement('img');
  full.src = img.src; full.alt = img.alt || '';
  lbContent.appendChild(full);
  lightbox.classList.add('open'); lock(true);
});
const closeLightbox = () => { lightbox.classList.remove('open'); lock(false); };
$('#lightboxClose').onclick = closeLightbox;
lightbox.onclick = e => { if (e.target === lightbox) closeLightbox(); };

/* ---------- MODALS ---------- */
const commModal = $('#commissionModal'), termsModal = $('#termsModal');
const openModal = m => { m.classList.add('open'); lock(true); };
const closeModal = m => {
  m.classList.remove('open');
  if (!$('.modal.open')) lock(false);
};
$('#openCommission').onclick = () => openModal(commModal);
$('#closeCommission').onclick = () => closeModal(commModal);
$('.modal-bg', commModal).onclick = () => closeModal(commModal);
$('#openTerms').onclick = () => openModal(termsModal);
$('#closeTerms').onclick = () => closeModal(termsModal);
$('#termsDone').onclick = () => closeModal(termsModal);
$('.modal-bg', termsModal).onclick = () => closeModal(termsModal);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeLightbox();
  if (termsModal.classList.contains('open')) closeModal(termsModal);
  else if (commModal.classList.contains('open')) closeModal(commModal);
});

/* ---------- TERMS (EN / ES) ---------- */
const TERMS = {
  en: {
    title: 'Commission <mark>terms.</mark>', btn: 'TRANSLATE / ES',
    items: [
      ['01 / PAYMENT', 'Payment is required before the artwork is started. Prices listed on this website are starting prices and may change depending on the complexity of the request.'],
      ['02 / PROCESS', 'After receiving your request, I will review the details and contact you to confirm the commission, price and estimated timeframe.'],
      ['03 / REVISIONS', 'Minor revisions are allowed during the sketch stage. Major changes requested after approval may require an additional fee.'],
      ['04 / DEADLINES', 'Completion times may vary depending on my current queue, the complexity of the artwork and other circumstances. I will communicate significant delays.'],
      ['05 / REFUNDS', 'Refund requests are handled individually depending on the current stage of the commission.'],
      ['06 / USAGE', 'The finished artwork remains the property of the artist. The commissioner receives personal-use rights unless commercial usage is explicitly agreed upon.'],
      ['07 / NSFW', 'Mature commissions may be accepted depending on the subject and content. Requests outside my boundaries will be declined.'],
      ['08 / ARTIST RIGHTS', 'I reserve the right to decline a commission request. I may display completed artwork in my portfolio unless a private commission arrangement has been agreed upon.']
    ]
  },
  es: {
    title: 'Términos de <mark>comisión.</mark>', btn: 'ENGLISH / EN',
    items: [
      ['01 / PAGO', 'El pago debe realizarse antes de comenzar el trabajo. Los precios publicados en este sitio son precios base y pueden cambiar dependiendo de la complejidad de la solicitud.'],
      ['02 / PROCESO', 'Después de recibir tu solicitud, revisaré los detalles y me pondré en contacto contigo para confirmar la comisión, el precio y el tiempo estimado.'],
      ['03 / REVISIONES', 'Se permiten cambios menores durante la etapa del boceto. Los cambios importantes solicitados después de la aprobación pueden requerir un costo adicional.'],
      ['04 / TIEMPOS', 'El tiempo de entrega puede variar dependiendo de mi lista de espera, la complejidad del dibujo y otras circunstancias. Comunicaré cualquier retraso importante.'],
      ['05 / REEMBOLSOS', 'Las solicitudes de reembolso serán evaluadas individualmente dependiendo de la etapa en la que se encuentre la comisión.'],
      ['06 / USO', 'La obra terminada continúa siendo propiedad del artista. El cliente recibe derechos de uso personal, a menos que se haya acordado explícitamente un uso comercial.'],
      ['07 / NSFW', 'Puedo aceptar determinadas comisiones de contenido adulto dependiendo del tema y contenido. Las solicitudes fuera de mis límites serán rechazadas.'],
      ['08 / DERECHOS DEL ARTISTA', 'Me reservo el derecho de rechazar una solicitud de comisión. Puedo mostrar las obras terminadas en mi portafolio, salvo que se haya acordado una comisión privada. hehe.']
    ]
  }
};
let lang = 'en';
function renderTerms() {
  const t = TERMS[lang];
  $('#termsTitle').innerHTML = t.title;
  $('#translateTerms').textContent = t.btn;
  $('#termsBody').innerHTML = t.items.map(([h, p]) => `<section class="tsec"><h3>${h}</h3><p>${p}</p></section>`).join('');
}
renderTerms();
$('#translateTerms').onclick = () => { lang = lang === 'en' ? 'es' : 'en'; renderTerms(); };

/* ---------- FORM HELPERS ---------- */
const PLACEHOLDERS = { Reddit: 'u/yourusername', Bluesky: '@yourusername.bsky.social' };
$$('input[name="contactMethod"]').forEach(i => i.onchange = () => {
  $('#commissionContact').placeholder = PLACEHOLDERS[i.value] || '@yourusername';
});
const termsBox = $('#commissionTerms'), submitBtn = $('#commissionSubmit');
termsBox.onchange = () => (submitBtn.disabled = !termsBox.checked);

/* ---------- SUPABASE ---------- */
const supabaseClient = window.supabase.createClient(
  'https://orgrbrcfjssvdaxlxxfx.supabase.co',
  'sb_publishable_ZDeBcBinU4rYXPemRjO4DA_-hGWs6YH'
);

const form = $('#commissionForm'), success = $('#commissionSuccess'), intro = $('.modal-intro');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(form);
  submitBtn.disabled = true;
  const { error } = await supabaseClient.from('commissions').insert([{
    name: f.get('name'),
    contact_method: f.get('contactMethod'),
    contact: f.get('contact'),
    email: f.get('email'),
    commission_type: f.get('type'),
    description: f.get('description'),
    references_url: f.get('references') || null,
    status: 'RECEIVED',
    is_public: false
  }]);
  if (error) {
    console.error('Commission submission error:', error);
    alert('Something went wrong while sending your request. Please try again.');
    submitBtn.disabled = false;
    return;
  }
  form.style.display = 'none'; intro.style.display = 'none';
  success.classList.add('show');
});
$('#successClose').onclick = () => {
  success.classList.remove('show');
  form.style.display = ''; intro.style.display = '';
  form.reset(); submitBtn.disabled = true;
  closeModal(commModal);
};

/* ---------- COMM STATUS ---------- */
$$('[data-status-tab]').forEach(tab => tab.onclick = () => {
  $$('[data-status-tab]').forEach(t => t.classList.remove('active'));
  $$('.spanel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  $('#status-' + tab.dataset.statusTab).classList.add('active');
});

const esc = v => v == null ? '' : String(v)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const pad = n => String(n + 1).padStart(3, '0');
const PROGRESS = { SKETCH: '#ff3b30', ADJUSTING: '#ffd60a', REFINING: '#30d158', 'ALMOST DONE': '#ff5a1f' };

async function loadStatus() {
  const { data, error } = await supabaseClient
    .from('public_commission_status')
    .select('id, name, commission_type, status, created_at, image_url')
    .order('created_at', { ascending: true });
  if (error) return console.error('Public commission status error:', error);
  const all = data || [];

  const done = all.filter(c => c.status === 'FINISHED');
  $('#commFinishedGrid').innerHTML = done.length ? done.map((c, i) => `
    <article class="fcard">
      <div class="fimg">
        ${c.image_url ? `<img src="${esc(c.image_url)}" alt="Commission for ${esc(c.name)}" loading="lazy">` : 'FINISHED'}
        <span class="fnum">${pad(i)}</span>
      </div>
      <div class="finfo"><span>COMMISSION / FINISHED</span><strong>${esc(c.name)}</strong></div>
    </article>`).join('') : '<div class="empty">NO FINISHED COMMISSIONS YET.</div>';

  const wip = all.filter(c => c.status in PROGRESS);
  $('#commProgressList').innerHTML = wip.length ? wip.map((c, i) => `
    <article class="pitem">
      <div class="pimg">${c.image_url ? `<img src="${esc(c.image_url)}" alt="Commission for ${esc(c.name)}" loading="lazy">` : 'NO IMAGE'}</div>
      <div class="pmain">
        <span class="pbar" style="background:${PROGRESS[c.status]}"></span>
        <div><strong>${esc(c.name)}</strong><span>${esc(c.status)}</span></div>
      </div>
      <span class="pcode">COMM / ${pad(i)}</span>
    </article>`).join('') : '<div class="empty">NO COMMISSIONS IN PROGRESS.</div>';
}
loadStatus();

/* ---------- HERO PARALLAX ---------- */
const hero = $('.hero');
if (hero && matchMedia('(hover:hover) and (min-width:769px)').matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth - .5) * 40;
    ty = (e.clientY / innerHeight - .5) * 40;
  });
  (function loop() {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    hero.style.setProperty('--px', cx + 'px');
    hero.style.setProperty('--py', cy + 'px');
    requestAnimationFrame(loop);
  })();
}

/* ---------- SCROLL REVEAL ---------- */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .08 });
$$('.price, .legend div, .facts div, .sec-head').forEach(el => {
  el.style.cssText += ';opacity:0;transform:translateY(24px);transition:opacity .6s,transform .6s';
  io.observe(el);
});
const st = document.createElement('style');
st.textContent = '.in{opacity:1!important;transform:none!important}';
document.head.appendChild(st);
