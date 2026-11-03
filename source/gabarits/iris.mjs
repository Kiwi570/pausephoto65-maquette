/* Géométrie du diaphragme, partagée par le gabarit (première image) et par assets/js/projet/iris.js.
   Disque de rayon 100 centré en 0, ouverture heptagonale de rayon a, tournée de rot degrés.
   Les arêtes des lamelles prolongent chaque côté de l'ouverture jusqu'au bord du disque. */
export const LAMES = 7;

export function sommets(a, rot = 0, n = LAMES) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = ((rot + (360 / n) * i - 90) * Math.PI) / 180;
    pts.push([a * Math.cos(t), a * Math.sin(t)]);
  }
  return pts;
}

const f = (v) => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));

/* Anneau sombre percé de l'ouverture (règle evenodd). */
export function cheminLames(a, rot = 0, R = 100) {
  const ouv = Math.max(0.4, a);
  const s = sommets(ouv, rot);
  return `M${-R} 0a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`
    + 'M' + s.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
}

/* Arêtes : chaque côté de l'ouverture prolongé jusqu'au bord. */
export function cheminAretes(a, rot = 0, R = 100) {
  const ouv = Math.max(0.4, a);
  const s = sommets(ouv, rot);
  let d = '';
  for (let i = 0; i < s.length; i++) {
    const [x1, y1] = s[i], [x2, y2] = s[(i + 1) % s.length];
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
    const ux = dx / l, uy = dy / l;
    /* Intersection du prolongement avec le cercle de rayon R. */
    const b = x2 * ux + y2 * uy, c = x2 * x2 + y2 * y2 - R * R;
    const t = -b + Math.sqrt(Math.max(0, b * b - c));
    d += `M${f(x2)} ${f(y2)}L${f(x2 + ux * t)} ${f(y2 + uy * t)}`;
  }
  return d;
}
