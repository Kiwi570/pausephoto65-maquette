/* Course du soleil à Tarbes, calculée en direct (algorithme de la NOAA) :
   lever, coucher, et heure dorée du soir (du moment où le soleil passe sous 6° au coucher).
   Les heures sont affichées à l'heure de Tarbes (Europe/Paris), quel que soit le fuseau du visiteur. */
const rad = Math.PI / 180;

function heuresSoleil(date, lat, lon, zenith) {
  /* Jour julien et position du soleil à midi UTC du jour donné. */
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = Math.floor(jd - 2451545.0 + 0.0008);
  const jEtoile = n - lon / 360;
  const M = (357.5291 + 0.98560028 * jEtoile) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360;
  const jTransit = 2451545.0 + jEtoile + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const decl = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const cosH = (Math.cos(zenith * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad;
  const versDate = (j) => new Date((j - 2440587.5) * 86400000);
  return { lever: versDate(jTransit - H / 360), coucher: versDate(jTransit + H / 360), midi: versDate(jTransit) };
}

export function initSoleil() {
  const bloc = document.querySelector('[data-soleil]');
  if (!bloc) return;
  const lat = +bloc.dataset.lat, lon = +bloc.dataset.lon, fuseau = bloc.dataset.fuseau || 'Europe/Paris';
  const maintenant = new Date();
  const jour = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate(), 12));
  const s = heuresSoleil(jour, lat, lon, 90.833);
  const d = heuresSoleil(jour, lat, lon, 84);
  if (!s) return;
  const fmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: fuseau });
  const h = (x) => fmt.format(x).replace(':', ' h ').replace(/^0(\d)/, '$1');
  bloc.querySelector('[data-soleil-date]').textContent = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: fuseau }).format(maintenant);
  bloc.querySelector('[data-soleil-lever]').textContent = h(s.lever);
  bloc.querySelector('[data-soleil-coucher]').textContent = h(s.coucher);
  const debutDoree = d ? d.coucher : new Date(s.coucher.getTime() - 3600000);
  bloc.querySelector('[data-soleil-plage]').textContent = `${h(debutDoree)} – ${h(s.coucher)}`;
  /* Arc : du lever (0) au coucher (1). */
  const duree = s.coucher - s.lever;
  const t0 = Math.max(0, Math.min(1, (debutDoree - s.lever) / duree));
  const doree = bloc.querySelector('[data-soleil-doree]');
  doree.style.strokeDasharray = `${(1 - t0).toFixed(4)} 1`;
  doree.style.strokeDashoffset = `${(-t0).toFixed(4)}`;
  const course = bloc.querySelector('.soleil-course');
  const point = bloc.querySelector('[data-soleil-point]');
  const t = (maintenant - s.lever) / duree;
  if (t < 0 || t > 1) { point.style.opacity = '0.35'; }
  const L = course.getTotalLength();
  const p = course.getPointAtLength(Math.max(0, Math.min(1, t)) * L);
  point.setAttribute('cx', p.x.toFixed(1));
  point.setAttribute('cy', p.y.toFixed(1));
}
