/* PausePhoto65 — effets du projet. Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles et les mesures ; ce fichier n'orchestre que ce qui est propre au client. */
import { demarrer, etat, quand } from './socle/index.js?v=2';
import { timelineIntro, nettoyerIntro, animerVoile } from './projet/iris.js?v=2';
import { initMiseAuPoint, observer, lancer, toutNet, presser } from './projet/mise-au-point.js?v=2';
import { parallaxes, magnetiques, inclinaisons, curseurViseur, pausePose, planche, tirages, faq } from './projet/effets.js?v=2';
import { initGalerie } from './projet/galerie.js?v=2';
import { initParcours } from './projet/parcours.js?v=2';
import { initSoleil } from './projet/soleil.js?v=2';
import { initCarte, initAlbum } from './projet/lieux.js?v=2';
import { initPluie, initManipuler, bandeaux, lettres, retourner } from './projet/vivant.js?v=2';

const gsap = window.gsap;
const ST = window.ScrollTrigger;

const hero = () => document.querySelector('[data-hero]');
const sel = {
  lignes: '.hero-ligne',
  cote: '.hero-cote',
  entree: '[data-entree]',
  entete: '.entete-rangee',
};

/* Éléments du premier écran animés par le projet : état final exact (aucun saut à la fin). */
function etatFinalPage() {
  if (!gsap) return;
  gsap.set([sel.lignes, sel.cote, sel.entree, sel.entete].join(','), { clearProps: 'transform,opacity' });
  nettoyerIntro();
}

/* Arrivée du contenu du premier écran, après l'intro ou pendant que le voile se retire. */
function arriveeContenu(tl, t0) {
  const lignes = document.querySelectorAll(sel.lignes);
  const entree = document.querySelectorAll(sel.entree);
  const cote = document.querySelectorAll(sel.cote);
  if (lignes.length) tl.fromTo(lignes, { yPercent: 112, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, t0);
  if (cote.length) tl.fromTo(cote, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, t0 + 0.35);
  if (entree.length) tl.fromTo(entree, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' }, t0);
  return tl;
}

/* La photo d'ouverture est préparée (WebGL) pendant l'attente, avant l'intro. */
const preparation = initMiseAuPoint();
/* Pendant l'intro, la première action du visiteur écourte aussi la mise au point de la photo d'ouverture. */
{
  const types = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  const action = () => { presser(); types.forEach((t) => window.removeEventListener(t, action, true)); };
  types.forEach((t) => window.addEventListener(t, action, { capture: true, passive: true }));
  quand('pret', () => setTimeout(() => types.forEach((t) => window.removeEventListener(t, action, true)), 1400));
}

demarrer({
  pret: [preparation],
  preparer() {
    initParcours(gsap);
    initSoleil();
    initCarte();
    if (!gsap || !ST) { toutNet(); return; }
    initGalerie(gsap, ST);
    initAlbum(gsap, ST, etat.calme);
    const pluie = initPluie(gsap, ST, etat.calme);
    retourner();
    if (!etat.calme) {
      bandeaux(gsap, false);
      initManipuler(gsap, false);
      if (etat.arrivee !== 'retour') lettres(gsap, ST);
    }
    faq();
    pausePose(gsap, ST, etat.calme);
    if (!etat.calme) {
      parallaxes(gsap, ST);
      magnetiques(gsap);
      inclinaisons(gsap);
      curseurViseur();
      planche(gsap, ST);
      tirages(gsap, ST);
    }
    /* Voile : le diaphragme se ferme au départ et se rouvre à l'arrivée. */
    quand('depart', () => animerVoile(gsap, 'fermer'));
    if (etat.arrivee === 'voile') animerVoile(gsap, 'ouvrir');
    /* Les autres photos font leur mise au point à leur entrée dans l'écran, une fois la page découverte. */
    quand('pret', ({ mode }) => {
      if (mode === 'jouee' || mode === 'voile') { observer(); pluie.tomber(); } else { toutNet(); pluie.poser(); }
      /* Rechargement : si la page n'a pas fini de charger à la fin de l'intro, le navigateur ne doit pas
         ramener l'ancienne position (l'intro repart du haut) ; la restauration revient après le chargement. */
      const nav = performance.getEntriesByType('navigation')[0];
      if (mode === 'jouee' && nav && nav.type === 'reload' && document.readyState !== 'complete' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
        window.addEventListener('load', () => setTimeout(() => { history.scrollRestoration = 'auto'; }, 0), { once: true });
      }
    });
  },

  /* Intro (≈ 2,2 s) : diaphragme qui se ferme puis se rouvre, ouverture qui découvre la page ;
     la photo d'ouverture fait sa mise au point, le titre monte ligne à ligne, l'en-tête arrive. */
  jouer() {
    if (!gsap) return null;
    const tl = timelineIntro(gsap, { surOuverture: () => { const h = hero(); if (h) lancer(h, { duree: 1150 }); observer(); } });
    arriveeContenu(tl, 1.35);
    tl.fromTo(sel.entete, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.55);
    return tl;
  },

  etatFinal() { etatFinalPage(); toutNet(); },

  /* Arrivée par un lien interne : la page se découvre sous le voile, son premier écran se met en place. */
  arrivee() {
    if (!gsap) return;
    const h = hero();
    if (h) lancer(h, { duree: 1000 });
    observer();
    arriveeContenu(gsap.timeline(), 0.12);
  },
});

