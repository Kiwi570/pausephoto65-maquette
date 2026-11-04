/* Vie de la v2 : pluie de tirages du premier écran (qu'on attrape et qu'on lance), photos à déplacer,
   bandeaux de grands mots liés au défilement, titres lettre à lettre, tirages des séances qui se retournent.
   Rien de tout cela ne tourne en mode calme : la page y est directement dans son état final. */
const souris = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
let z = 10;

/* Rend un élément attrapable : on le déplace, on le lâche, il glisse, rebondit sur les bords de sa zone et s'arrête.
   La boucle d'animation ne tourne que pendant le vol. */
export function manipulable(gsap, el, zone, { pret = () => true } = {}) {
  const setX = gsap.quickSetter(el, 'x', 'px'), setY = gsap.quickSetter(el, 'y', 'px'), setR = gsap.quickSetter(el, 'rotation', 'deg');
  let x = 0, y = 0, r = 0, vx = 0, vy = 0, vol = 0, hist = [], borne = null;
  const appliquer = () => { setX(x); setY(y); setR(r); };
  const bornes = () => {
    const zr = zone.getBoundingClientRect(), er = el.getBoundingClientRect();
    const bx = er.left - x, by = er.top - y; /* position de repos */
    const marge = Math.min(er.width, er.height) * 0.35;
    return { minX: zr.left - bx - marge, maxX: zr.right - bx - er.width + marge, minY: zr.top - by - marge, maxY: zr.bottom - by - er.height + marge };
  };
  const voler = () => {
    let t = performance.now();
    const pas = (n) => {
      const dt = Math.min(32, n - t); t = n;
      x += vx * dt; y += vy * dt;
      const f = Math.pow(0.93, dt / 16); vx *= f; vy *= f;
      if (x < borne.minX) { x = borne.minX; vx = Math.abs(vx) * 0.55; }
      if (x > borne.maxX) { x = borne.maxX; vx = -Math.abs(vx) * 0.55; }
      if (y < borne.minY) { y = borne.minY; vy = Math.abs(vy) * 0.55; }
      if (y > borne.maxY) { y = borne.maxY; vy = -Math.abs(vy) * 0.55; }
      r = Math.max(-28, Math.min(28, r + vx * dt * 0.06)) * Math.pow(0.985, dt / 16);
      appliquer();
      if (Math.hypot(vx, vy) > 0.015) vol = requestAnimationFrame(pas);
      else { vol = 0; el.classList.remove('saisi'); }
    };
    vol = requestAnimationFrame(pas);
  };
  el.addEventListener('pointerdown', (e) => {
    if (!pret() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    cancelAnimationFrame(vol); vol = 0;
    borne = bornes();
    el.setPointerCapture(e.pointerId);
    el.classList.add('saisi');
    el.style.zIndex = String(++z);
    const sx = e.clientX - x, sy = e.clientY - y;
    hist = [[e.clientX, e.clientY, performance.now()]];
    const bouger = (ev) => {
      x = Math.max(borne.minX, Math.min(borne.maxX, ev.clientX - sx));
      y = Math.max(borne.minY, Math.min(borne.maxY, ev.clientY - sy));
      const d = ev.clientX - hist[hist.length - 1][0];
      r = Math.max(-22, Math.min(22, r * 0.9 + d * 0.4));
      hist.push([ev.clientX, ev.clientY, performance.now()]); if (hist.length > 6) hist.shift();
      appliquer();
    };
    const lacher = () => {
      el.removeEventListener('pointermove', bouger); el.removeEventListener('pointerup', lacher); el.removeEventListener('pointercancel', lacher);
      const a = hist[0], b = hist[hist.length - 1], dt = Math.max(16, b[2] - a[2]);
      vx = Math.max(-3, Math.min(3, (b[0] - a[0]) / dt)); vy = Math.max(-3, Math.min(3, (b[1] - a[1]) / dt));
      if (performance.now() - b[2] > 90) { vx = 0; vy = 0; }
      voler();
    };
    el.addEventListener('pointermove', bouger);
    el.addEventListener('pointerup', lacher);
    el.addEventListener('pointercancel', lacher);
  });
}

/* Pluie de tirages : ils tombent à l'arrivée, s'éparpillent au défilement, s'attrapent et se lancent. */
export function initPluie(gsap, ST, calme) {
  const zone = document.querySelector('[data-pluie]');
  const rien = { tomber() {}, poser() {} };
  if (!zone || !gsap) return rien;
  const cadres = [...zone.querySelectorAll('.pluie-cadre')];
  const indice = zone.querySelector('.pluie-indice');
  let pose = false;
  const fin = () => { pose = true; zone.classList.add('pluie-posee'); };
  const poser = () => { gsap.set(cadres, { opacity: 1, clearProps: 'transform' }); if (indice) gsap.set(indice, { opacity: 1 }); fin(); };
  if (calme) { poser(); return rien; }
  cadres.forEach((c) => manipulable(gsap, c, zone, { pret: () => pose }));
  /* Au défilement, les tirages s'envolent vers les bords, chacun à sa vitesse. */
  const tirages = [...zone.querySelectorAll('.pluie-tirage')];
  ST.create({
    trigger: zone, start: 'top top', end: 'bottom top', scrub: 0.6,
    animation: gsap.timeline().to(tirages, {
      y: (i) => -(90 + (i % 4) * 55), x: (i, el) => (el.offsetLeft < zone.clientWidth / 2 ? -1 : 1) * (30 + (i % 3) * 40),
      rotation: (i) => (i % 2 ? 1 : -1) * (6 + (i % 3) * 4), ease: 'none',
    }),
  });
  const tomber = () => {
    const visibles = cadres.filter((c) => c.offsetParent !== null);
    const caches = cadres.filter((c) => !visibles.includes(c));
    if (caches.length) gsap.set(caches, { opacity: 1 });
    if (!visibles.length) { fin(); return; }
    gsap.fromTo(visibles,
      { opacity: 1, y: (i, el) => -(el.getBoundingClientRect().bottom + 60 + (i % 3) * 70), rotation: (i) => (i % 2 ? 1 : -1) * (18 + (i % 4) * 7) },
      { y: 0, rotation: 0, duration: 1.15, ease: 'back.out(1.25)', stagger: { each: 0.08, from: 'random' }, onComplete: fin });
    if (indice) gsap.fromTo(indice, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.6, clearProps: 'transform' });
  };
  return { tomber, poser };
}

/* Photos d'une zone à déplacer (galerie) : sur ordinateur seulement, le téléphone garde son défilement. */
export function initManipuler(gsap, calme) {
  if (calme || !souris()) return;
  document.querySelectorAll('[data-manipuler]').forEach((zone) => {
    zone.classList.add('manipulable');
    zone.querySelectorAll(':scope > figure').forEach((f) => manipulable(gsap, f, zone));
  });
}

/* Bandeaux de grands mots : course continue, accélérée par le défilement, qui change de sens avec lui.
   Ils ne bougent que lorsqu'ils sont à l'écran. */
export function bandeaux(gsap, calme) {
  const liste = [...document.querySelectorAll('[data-bandeau]')];
  if (calme || !liste.length) return;
  let dernier = scrollY, elan = 0, sens = 1;
  const etats = liste.map((b) => ({ b, piste: b.querySelector('.bandeau-piste'), x: 0, w: 0, vu: false, base: +b.dataset.sens || -1 }));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const s = etats.find((q) => q.b === e.target); if (s) s.vu = e.isIntersecting; }));
  etats.forEach((s) => {
    const mesurer = () => { s.w = s.piste.scrollWidth / 2; };
    new ResizeObserver(mesurer).observe(s.piste); mesurer(); io.observe(s.b);
  });
  gsap.ticker.add((t, dt) => {
    const y = scrollY, d = y - dernier; dernier = y;
    if (d) sens = d > 0 ? 1 : -1;
    elan = elan * 0.92 + Math.min(40, Math.abs(d)) * 0.08;
    for (const s of etats) {
      if (!s.vu || !s.w) continue;
      s.x += s.base * sens * dt * 0.045 * (1 + elan * 0.6);
      if (s.x <= -s.w) s.x += s.w; else if (s.x > 0) s.x -= s.w;
      s.piste.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0)`;
    }
  });
}

/* Titres de section : les lettres se posent une à une quand le titre entre dans l'écran. */
export function lettres(gsap, ST) {
  const S = window.SplitText;
  if (!S) return;
  document.querySelectorAll('main section:not(#ouverture) .titre-section, main .titre-fin').forEach((h) => {
    /* Le titre n'est plus animé en bloc (son décalage fausserait les positions de défilement) : ses lettres le sont. */
    h.removeAttribute('data-anime');
    const s = S.create ? S.create(h, { type: 'words,chars', aria: 'auto' }) : new S(h, { type: 'words,chars' });
    /* Chaque mot découpé forme une boîte qui touche celles de la ligne voisine (hauteur de la police) :
       superposition voulue, exclue du contrôle des chevauchements ; le titre lui-même reste contrôlé. */
    s.words.forEach((w) => w.setAttribute('data-superpose', ''));
    /* Lettres réduites sur place au départ : elles ne débordent jamais sur les lignes voisines. */
    gsap.set(s.chars, { opacity: 0, scale: 0.35, transformOrigin: '50% 80%' });
    ST.create({ trigger: h, start: 'top 90%', once: true, onEnter: () => gsap.to(s.chars, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)', stagger: 0.018, clearProps: 'transform' }) });
  });
}

/* Tirages des séances : ils se retournent au survol (ordinateur) ou au toucher (téléphone). */
export function retourner() {
  document.querySelectorAll('[data-retourner]').forEach((t) => {
    t.addEventListener('click', (e) => { if (!souris()) { e.preventDefault(); t.classList.toggle('retournee'); } });
  });
}
