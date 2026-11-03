/* Diaphragme : géométrie (même calcul que source/gabarits/iris.mjs), intro et icône du voile.
   Disque de rayon 100, ouverture heptagonale de rayon a, tournée de rot degrés. */
const LAMES = 7;

function sommets(a, rot = 0, n = LAMES, cx = 0, cy = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = ((rot + (360 / n) * i - 90) * Math.PI) / 180;
    pts.push([cx + a * Math.cos(t), cy + a * Math.sin(t)]);
  }
  return pts;
}
const f = (v) => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));

export function cheminLames(a, rot = 0, R = 100) {
  const s = sommets(Math.max(0.4, a), rot);
  return `M${-R} 0a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z` + 'M' + s.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
}

export function cheminAretes(a, rot = 0, R = 100) {
  const s = sommets(Math.max(0.4, a), rot);
  let d = '';
  for (let i = 0; i < s.length; i++) {
    const [x1, y1] = s[i], [x2, y2] = s[(i + 1) % s.length];
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    const b = x2 * ux + y2 * uy, c = x2 * x2 + y2 * y2 - R * R;
    const t = -b + Math.sqrt(Math.max(0, b * b - c));
    d += `M${f(x2)} ${f(y2)}L${f(x2 + ux * t)} ${f(y2 + uy * t)}`;
  }
  return d;
}

/* Découpe du panneau d'intro : tout l'écran, percé d'un heptagone (règle evenodd). */
function trou(w, h, cx, cy, r, rot) {
  const s = sommets(r, rot, LAMES, cx, cy);
  return `path(evenodd, "M0 0H${w.toFixed(0)}V${h.toFixed(0)}H0Z M${s.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z")`;
}

/* Intro (environ 2,2 s) : le diaphragme se ferme (pause), se rouvre sur la photo nette (pose),
   puis l'ouverture s'agrandit jusqu'à découvrir toute la page. Renvoie la timeline GSAP. */
export function timelineIntro(gsap, { surOuverture } = {}) {
  const panneau = document.querySelector('[data-ouverture]');
  const iris = panneau && panneau.querySelector('.iris');
  const svg = iris && iris.querySelector('.iris-svg');
  if (!panneau || !iris || !svg) return gsap.timeline();
  const lames = svg.querySelector('.iris-lames'), aretes = svg.querySelector('.iris-aretes');
  const photo = iris.querySelector('.iris-photo img');
  const textes = panneau.querySelectorAll('.ouverture-nom, .ouverture-ligne');
  const e = { a: 58, rot: 0, t: 0 };
  const dessiner = () => { lames.setAttribute('d', cheminLames(e.a, e.rot)); aretes.setAttribute('d', cheminAretes(e.a, e.rot)); };
  /* Mesures prises une fois, au départ (rien n'est lu pendant l'animation). */
  const w = window.innerWidth, h = window.innerHeight;
  const r = iris.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2, rayonPx = r.width / 2;
  const diag = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.15;
  const ouvrir = () => {
    const ap = (e.a / 100) * rayonPx;
    const R = ap + (diag - ap) * e.t;
    const echelle = R / Math.max(1, ap);
    iris.style.transform = `scale(${echelle.toFixed(4)})`;
    /* Les lames s'effacent pendant qu'elles s'écartent : pas de grand anneau sombre qui balaie l'écran. */
    const k = Math.min(1, Math.max(0, (R / diag - 0.08) / 0.2)); /* l'anneau a disparu avant d'être grand */
    iris.style.opacity = (1 - k * k * (3 - 2 * k)).toFixed(3);
    panneau.style.clipPath = trou(w, h, cx, cy, R, e.rot);
  };
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(textes, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 0.02)
    .fromTo(e, { a: 58, rot: 0 }, { a: 0, rot: 38, duration: 0.48, ease: 'power2.in', onUpdate: dessiner }, 0.05)
    .fromTo(e, { a: 0, rot: 38 }, { a: 64, rot: -6, duration: 0.5, ease: 'power2.out', onUpdate: dessiner, immediateRender: false }, 0.62)
    .fromTo(photo, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.42 }, 0.7)
    .to(textes, { opacity: 0, duration: 0.22, ease: 'power1.out' }, 1.08)
    .call(() => surOuverture && surOuverture(), null, 1.1)
    .fromTo(e, { t: 0 }, { t: 1, rot: 14, duration: 1.15, ease: 'sine.inOut', onUpdate: ouvrir, immediateRender: false }, 1.12);
  return tl;
}

/* État final de l'intro (retour, calme, secours, ou intro passée) : rien ne reste découpé. */
export function nettoyerIntro() {
  const panneau = document.querySelector('[data-ouverture]');
  if (!panneau) return;
  panneau.style.clipPath = '';
  const iris = panneau.querySelector('.iris');
  if (iris) { iris.style.transform = ''; iris.style.opacity = ''; }
}

/* Icône du voile : se ferme au départ, se rouvre à l'arrivée. */
export function animerVoile(gsap, sens) {
  const svg = document.querySelector('.voile-iris');
  if (!svg || !gsap) return;
  const lames = svg.querySelector('.iris-lames'), aretes = svg.querySelector('.iris-aretes');
  const e = sens === 'fermer' ? { a: 46, rot: 0 } : { a: 2, rot: 40 };
  gsap.to(e, {
    a: sens === 'fermer' ? 2 : 46, rot: sens === 'fermer' ? 40 : 0, duration: sens === 'fermer' ? 0.42 : 0.6, ease: 'power2.inOut',
    onUpdate: () => { lames.setAttribute('d', cheminLames(e.a, e.rot)); aretes.setAttribute('d', cheminAretes(e.a, e.rot)); },
  });
}
