/* Galerie : salles horizontales épinglées (ordinateur), teinte du fond qui suit la photo au centre,
   filtres gardés dans l'adresse (?univers=), visionneuse plein écran (photo entière, flèches, glisser, Échap,
   focus gardé puis rendu, un lien par photo : #photo-…). */
import { etat, rafraichir, aller, suivre, lacher, bloquerDefilement, debloquerDefilement, quand } from '../socle/index.js?v=1';

const html = document.documentElement;

function salles(gsap, ST) {
  const liste = [...document.querySelectorAll('[data-salle]')];
  if (!liste.length || etat.calme) return;
  ST.matchMedia({
    '(min-width: 761px)': () => {
      const tues = [];
      liste.forEach((s) => {
        const piste = s.querySelector('.salle-piste');
        const barre = s.querySelector('.galerie-progres span');
        const cadres = [...piste.querySelectorAll('.cadre')];
        let centres = [], courant = -1;
        piste.removeAttribute('tabindex');
        const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
        /* Le défilement horizontal va un peu plus vite que la molette : la salle se parcourt sans longueur. */
        const course = () => distance() * 0.7;
        /* Centres des photos, mesurés au rafraîchissement seulement (jamais pendant le défilement). */
        const mesurer = () => { centres = cadres.map((c) => c.offsetLeft + c.offsetWidth / 2); };
        const tw = gsap.fromTo(piste, { x: 0 }, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: s, start: 'top top', end: () => '+=' + course(), pin: true, anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true,
            onRefresh: mesurer,
            onUpdate: (st) => {
              if (barre) barre.style.transform = `scaleX(${st.progress.toFixed(4)})`;
              const milieu = st.progress * distance() + window.innerWidth / 2;
              let i = 0, best = Infinity;
              centres.forEach((c, k) => { const d = Math.abs(c - milieu); if (d < best) { best = d; i = k; } });
              if (i !== courant && cadres[i]) { courant = i; s.style.setProperty('--teinte', cadres[i].dataset.couleur); }
            },
          },
        });
        tues.push(() => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); gsap.set(piste, { clearProps: 'transform' }); piste.setAttribute('tabindex', '0'); });
      });
      return () => tues.forEach((f) => f());
    },
  });
}

function filtres(gsap) {
  const boutons = [...document.querySelectorAll('[data-filtre]')];
  const liste = [...document.querySelectorAll('[data-salle]')];
  if (!boutons.length) return { courant: () => 'tous' };
  let choix = 'tous';
  const appliquer = (u, { anime = true } = {}) => {
    choix = liste.some((s) => s.dataset.salle === u) ? u : 'tous';
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === choix)));
    const visibles = liste.filter((s) => choix === 'tous' || s.dataset.salle === choix);
    liste.forEach((s) => { s.hidden = !visibles.includes(s); });
    const url = new URL(location.href);
    if (choix === 'tous') url.searchParams.delete('univers'); else url.searchParams.set('univers', choix);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    rafraichir();
    if (anime && gsap && !etat.calme) gsap.fromTo(visibles, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity' });
    /* La galerie a raccourci : on revient à son début plutôt que de rester dans le vide. */
    if (anime && visibles[0] && window.scrollY > visibles[0].offsetTop) setTimeout(() => aller(visibles[0]), 160);
  };
  boutons.forEach((b) => b.addEventListener('click', () => appliquer(b.dataset.filtre)));
  const p = new URLSearchParams(location.search).get('univers');
  if (p) appliquer(p, { anime: false });
  return { courant: () => choix };
}

function visionneuse(filtre) {
  const v = document.querySelector('[data-visionneuse]');
  const donnees = document.getElementById('galerie-donnees');
  if (!v || !donnees) return;
  let photos = [];
  try { photos = JSON.parse(donnees.textContent); } catch { return; }
  const img = v.querySelector('[data-visionneuse-image]');
  const legende = v.querySelector('[data-visionneuse-alt]');
  const pos = v.querySelector('[data-visionneuse-pos]');
  const fermer = v.querySelector('[data-visionneuse-fermer]');
  const prec = v.querySelector('[data-visionneuse-prec]'), suiv = v.querySelector('[data-visionneuse-suiv]');
  let liste = photos, i = 0, retour = null, ouvert = false;

  const afficher = (k) => {
    i = (k + liste.length) % liste.length;
    const p = liste[i];
    img.removeAttribute('src');
    img.srcset = p.srcset;
    img.sizes = '100vw';
    img.src = p.src;
    img.alt = p.alt;
    img.width = 1280; img.height = Math.round(1280 / p.r);
    legende.textContent = p.alt;
    pos.textContent = `${i + 1} / ${liste.length}`;
    history.replaceState(history.state, '', location.pathname + location.search + '#photo-' + p.id);
  };
  const ouvrir = (id, depuis) => {
    const u = filtre.courant();
    liste = u === 'tous' ? photos : photos.filter((p) => p.u === u);
    if (!liste.some((p) => p.id === id)) liste = photos;
    retour = depuis || document.getElementById('photo-' + id);
    afficher(liste.findIndex((p) => p.id === id));
    v.hidden = false;
    v.inert = false;
    ouvert = true;
    bloquerDefilement('visionneuse');
    suivre(v);
    html.classList.add('visionneuse-ouverte');
    if (!etat.calme && retour) {
      const r = retour.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      v.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)` }], { duration: 520, easing: 'cubic-bezier(.65,0,.35,1)' });
    }
    requestAnimationFrame(() => fermer.focus({ preventScroll: true }));
  };
  const clore = () => {
    if (!ouvert) return;
    ouvert = false;
    const fin = () => {
      v.hidden = true;
      v.inert = true;
      debloquerDefilement('visionneuse');
      lacher(v);
      html.classList.remove('visionneuse-ouverte');
      history.replaceState(history.state, '', location.pathname + location.search);
      if (retour) retour.focus({ preventScroll: true });
    };
    if (etat.calme) { fin(); return; }
    const a = v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out' });
    a.onfinish = fin;
  };
  document.querySelectorAll('[data-photo]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); ouvrir(a.dataset.photo, a); }));
  fermer.addEventListener('click', clore);
  prec.addEventListener('click', () => afficher(i - 1));
  suiv.addEventListener('click', () => afficher(i + 1));
  v.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); clore(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); afficher(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); afficher(i + 1); }
    else if (e.key === 'Tab') {
      const f = [fermer, prec, suiv];
      const k = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  /* Glisser au doigt : photo suivante ou précédente. */
  let x0 = null;
  const scene = v.querySelector('[data-visionneuse-scene]');
  scene.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  scene.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) afficher(i + (dx < 0 ? 1 : -1));
  });
  /* Lien direct vers une photo. */
  const depuisAncre = () => {
    const m = location.hash.match(/^#photo-([\w-]+)$/);
    if (!m || ouvert || !photos.some((p) => p.id === m[1])) return;
    const id = m[1];
    if (etat.pret) ouvrir(id); else quand('pret', () => ouvrir(id));
  };
  depuisAncre();
  window.addEventListener('hashchange', depuisAncre);
}

export function initGalerie(gsap, ST) {
  if (!document.querySelector('[data-salle]')) return;
  const f = filtres(gsap);
  if (gsap && ST) salles(gsap, ST);
  visionneuse(f);
}
