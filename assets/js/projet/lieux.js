/* Carte de la zone de déplacement (communes mises en avant au survol ou au toucher)
   et album de famille (vraies photos posées dans les coins de l'album, en perspective). */
const html = document.documentElement;

export function initCarte() {
  const carte = document.querySelector('[data-carte]');
  if (!carte) return;
  const section = carte.closest('section');
  const activer = (id) => {
    carte.querySelectorAll('[data-ville]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ville === id)));
    carte.querySelectorAll('[data-trajet]').forEach((p) => p.classList.toggle('actif', p.dataset.trajet === id));
    carte.querySelectorAll('[data-point]').forEach((p) => p.classList.toggle('actif', p.dataset.point === id));
    section.querySelectorAll('[data-ville-liste]').forEach((li) => li.classList.toggle('actif', li.dataset.villeListe === id));
  };
  carte.querySelectorAll('[data-ville]').forEach((b) => {
    b.addEventListener('click', () => activer(b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.ville));
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activer(b.dataset.ville); });
  });
  section.querySelectorAll('[data-ville-liste]').forEach((li) => li.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activer(li.dataset.villeListe); }));
  carte.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') activer(''); });
}

/* Transformation projective d'un rectangle (w × h) vers un quadrilatère : matrix3d. */
function adj(m) { return [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4], m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5], m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]]; }
function mm(a, b) { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; c[3 * i + j] = s; } return c; }
function mv(m, v) { return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]; }
function base(p) { const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1]; const v = mv(adj(m), [p[3][0], p[3][1], 1]); return mm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]); }
function projection(src, dst) {
  const t = mm(base(dst), adj(base(src)));
  for (let i = 0; i < 9; i++) t[i] /= t[8];
  return `matrix3d(${[t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].map((x) => +x.toFixed(6)).join(',')})`;
}

export function initAlbum(gsap, ST, calme) {
  const album = document.querySelector('[data-album]');
  if (!album) return;
  const photos = [...album.querySelectorAll('[data-coins]')];
  const placer = () => {
    const w = album.clientWidth, h = album.clientHeight;
    if (!w || !h) return;
    photos.forEach((el) => {
      /* Coins en % de l'illustration, légèrement rentrés pour que les pochettes restent visibles. */
      const q = el.dataset.coins.split(' ').map((c) => c.split(',').map(Number));
      const cx = q.reduce((s, p) => s + p[0], 0) / 4, cy = q.reduce((s, p) => s + p[1], 0) / 4;
      const pts = q.map(([x, y]) => [((cx + (x - cx) * 0.9) / 100) * w, ((cy + (y - cy) * 0.9) / 100) * h]);
      const lw = (Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) + Math.hypot(pts[2][0] - pts[3][0], pts[2][1] - pts[3][1])) / 2;
      const lh = (Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]) + Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1])) / 2;
      el.style.width = lw.toFixed(1) + 'px';
      el.style.height = lh.toFixed(1) + 'px';
      el.style.transform = projection([[0, 0], [lw, 0], [lw, lh], [0, lh]], pts);
      el.classList.add('place');
    });
  };
  placer();
  new ResizeObserver(placer).observe(album);
  const vu = () => photos.forEach((el) => el.classList.add('vu'));
  if (calme || !gsap || !ST || html.dataset.arrivee === 'retour') { vu(); return; }
  const interieurs = photos.map((el) => el.querySelector('figure'));
  ST.create({
    trigger: album, start: 'top 70%', once: true,
    onEnter: () => {
      vu();
      gsap.fromTo(interieurs, { y: -60, rotation: (i) => (i ? 7 : -8), opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.25 });
    },
  });
}
