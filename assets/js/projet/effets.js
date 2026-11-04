/* Effets communs du projet : parallaxe, boutons magnétiques, cartes qui s'inclinent, curseur viseur,
   Pause → Pose, planche contact au crayon, tirages qui se balancent, FAQ qui s'ouvre en douceur. */
const html = document.documentElement;
const souris = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export function parallaxes(gsap, ST) {
  ST.matchMedia({
    '(min-width: 761px)': () => {
      document.querySelectorAll('[data-parallaxe]').forEach((el) => {
        const n = parseFloat(el.dataset.parallaxe) || 8;
        gsap.fromTo(el, { yPercent: -n / 2 }, { yPercent: n / 2, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      /* L'image est agrandie plus que son déplacement : son bord n'apparaît jamais. */
      document.querySelectorAll('[data-parallaxe-interne] picture').forEach((p) => {
        gsap.fromTo(p, { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.14, ease: 'none', scrollTrigger: { trigger: p.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    },
  });
}

export function magnetiques(gsap) {
  if (!souris()) return;
  document.querySelectorAll('[data-magnetique]').forEach((b) => {
    const x = gsap.quickTo(b, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(b, 'y', { duration: 0.45, ease: 'power3.out' });
    let r = null;
    b.addEventListener('pointerenter', () => { r = b.getBoundingClientRect(); });
    b.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      x((e.clientX - (r.left + r.width / 2)) * 0.22);
      y((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    b.addEventListener('pointerleave', () => { x(0); y(0); r = null; });
  });
}

export function inclinaisons(gsap) {
  if (!souris()) return;
  document.querySelectorAll('[data-inclinaison]').forEach((carte) => {
    const cible = carte.querySelector('figure');
    if (!cible) return;
    gsap.set(cible, { transformPerspective: 900 });
    const rx = gsap.quickTo(cible, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(cible, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    let r = null;
    carte.addEventListener('pointerenter', () => { r = cible.getBoundingClientRect(); });
    carte.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 9); rx(-py * 7);
    });
    carte.addEventListener('pointerleave', () => { rx(0); ry(0); r = null; });
  });
}

/* Curseur appareil photo : des crochets de mise au point se referment autour des photos survolées ;
   chaque clic est un déclic (petit éclair autour du viseur) et le compteur de poses descend de 36 à 1. */
export function curseurViseur() {
  if (!souris()) return;
  let poses = 36;
  const viser = (e) => {
    const c = document.querySelector('.curseur');
    if (!c) return;
    if (!c.dataset.poses) c.dataset.poses = String(poses);
    const photo = e.target.closest && e.target.closest('[data-mise-au-point], .cadre, .vue-lien, .tirage, .pluie-cadre, .carte-tirage');
    c.classList.toggle('curseur-photo', !!photo);
  };
  document.addEventListener('pointerover', viser, { passive: true });
  let dernier = 0;
  document.addEventListener('pointerdown', (e) => {
    const c = document.querySelector('.curseur');
    if (!c || e.pointerType !== 'mouse' || e.button !== 0) return;
    const t = performance.now();
    if (t - dernier < 350) return; /* deux déclics par seconde au plus */
    dernier = t;
    poses = poses <= 1 ? 36 : poses - 1;
    c.dataset.poses = String(poses);
    c.classList.remove('declic'); void c.offsetWidth; c.classList.add('declic');
  }, { passive: true });
}

/* Pause → Pose : grand mot décoratif dessiné dans un canvas (police du site) ; au défilement, « au » s'efface,
   « o » prend sa place et « se » se resserre. Redessiné seulement quand la progression change. */
export function pausePose(gsap, ST, calme) {
  const c = document.querySelector('[data-mot-pause]');
  if (!c) return;
  const ctx = c.getContext('2d');
  const coul = { mot: '#ddd1bf', o: '#c98a62' };
  let m = null, p = 0;
  const mesurer = () => {
    const w = c.clientWidth || c.parentElement.clientWidth;
    if (!w) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const taille = Math.min(230, Math.max(96, w * 0.31));
    const h = Math.round(taille * 1.25);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `italic 300 ${taille}px Fraunces, 'Fraunces Secours', Georgia, serif`;
    const lp = ctx.measureText('P').width, lau = ctx.measureText('au').width, lo = ctx.measureText('o').width, lse = ctx.measureText('se').width;
    const total = lp + lau + lse;
    m = { w, h, taille, lp, lau, lo, lse, x0: (w - total) / 2, base: h * 0.74 };
  };
  const dessiner = () => {
    if (!m) return;
    const { w, h, taille, lp, lau, lo, x0, base } = m;
    ctx.clearRect(0, 0, w, h);
    ctx.font = `italic 300 ${taille}px Fraunces, 'Fraunces Secours', Georgia, serif`;
    ctx.textBaseline = 'alphabetic';
    const k = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
    const e = (t) => t * t * (3 - 2 * t);
    const sortie = e(k(0, 0.6)), entree = e(k(0.35, 1));
    ctx.fillStyle = coul.mot;
    ctx.fillText('P', x0, base);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 + lp - 4, 0, lau + 8, h); ctx.clip();
    ctx.globalAlpha = 1 - sortie;
    ctx.fillText('au', x0 + lp, base - sortie * h * 0.9);
    ctx.globalAlpha = 1;
    ctx.fillStyle = coul.o;
    ctx.fillText('o', x0 + lp, base + (1 - entree) * h);
    ctx.restore();
    ctx.fillStyle = coul.mot;
    ctx.fillText('se', x0 + lp + lau - (lau - lo) * entree, base);
  };
  const tout = () => { mesurer(); dessiner(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(tout);
  new ResizeObserver(() => tout()).observe(c.parentElement);
  if (calme || !gsap || !ST) return;
  ST.create({
    trigger: c, start: 'top 72%', end: 'bottom 30%', scrub: 0.6,
    onUpdate: (s) => { if (Math.abs(s.progress - p) > 0.002) { p = s.progress; dessiner(); } },
  });
}

/* Planche contact : les vues arrivent en pile au centre et s'étalent à leur place au défilement,
   puis les cercles au crayon se tracent sur les vues choisies. */
export function planche(gsap, ST) {
  const p = document.querySelector('[data-planche]');
  if (!p) return;
  const vues = [...p.querySelectorAll('.vue')];
  const cercles = p.querySelectorAll('.vue-cercle path');
  const k = () => (innerWidth > 760 ? 0.9 : 0.5);
  /* Positions lues dans la mise en page (offsetLeft/Top), jamais dans l'état transformé. */
  const dx = (i, el) => (p.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)) * k();
  const dy = (i, el) => (p.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2)) * k();
  gsap.fromTo(vues, { x: dx, y: dy, rotation: (i) => ((i * 37) % 23) - 11, scale: 0.88 }, {
    x: 0, y: 0, rotation: 0, scale: 1, ease: 'power2.out', stagger: 0.015,
    scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 30%', scrub: 0.7, invalidateOnRefresh: true },
  });
  ST.create({
    trigger: p, start: 'top 30%', once: true,
    onEnter: () => gsap.fromTo(cercles, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.35 }),
  });
}

/* Tirages : ils se balancent selon la vitesse du défilement, puis reviennent au repos (une seule
   animation par tirage, réutilisée : rien n'est créé pendant le défilement). */
export function tirages(gsap, ST) {
  const fil = document.querySelector('[data-fil]');
  if (!fil) return;
  ST.matchMedia({
    '(min-width: 761px)': () => {
      const liste = [...fil.querySelectorAll('[data-tirage]')];
      const base = liste.map((_, i) => (i - 2) * 0.9);
      liste.forEach((t, i) => gsap.set(t, { rotation: base[i] }));
      const vers = liste.map((t) => gsap.quickTo(t, 'rotation', { duration: 0.9, ease: 'power3.out' }));
      let repos = 0, derniere = 0;
      const st = ST.create({
        trigger: fil, start: 'top bottom', end: 'bottom top',
        onUpdate: (s) => {
          const v = Math.max(-1, Math.min(1, s.getVelocity() / 2400));
          if (Math.abs(v - derniere) < 0.04) return;
          derniere = v;
          vers.forEach((f, i) => f(base[i] + v * (5 + i)));
          clearTimeout(repos);
          repos = setTimeout(() => { derniere = 0; vers.forEach((f, i) => f(base[i])); }, 160);
        },
      });
      liste.forEach((t, i) => {
        t.addEventListener('pointerenter', () => vers[i](base[i] + (i % 2 ? 3 : -3)));
        t.addEventListener('pointerleave', () => vers[i](base[i]));
      });
      return () => { st.kill(); clearTimeout(repos); liste.forEach((t) => gsap.set(t, { clearProps: 'transform' })); };
    },
  });
}

/* FAQ : ouverture et fermeture animées (hauteur), sans à-coup ; en mode calme, comportement natif. */
export function faq() {
  if (html.classList.contains('calme')) return;
  document.querySelectorAll('.faq-item').forEach((d) => {
    const resume = d.querySelector('summary'), corps = d.querySelector('.faq-reponse');
    if (!resume || !corps) return;
    let anim = null;
    resume.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) anim.cancel();
      if (!d.open) {
        d.open = true;
        const h = corps.scrollHeight;
        anim = corps.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
        anim.onfinish = () => { anim = null; };
      } else {
        const h = corps.scrollHeight;
        anim = corps.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.65,0,.35,1)' });
        anim.onfinish = () => { d.open = false; anim = null; };
      }
    });
  });
}
