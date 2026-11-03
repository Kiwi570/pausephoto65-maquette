/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, panneau d'intro.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README).
   PausePhoto65 : pas de téléphone publié, le contact rapide est l'e-mail ; intro et voile en diaphragme. */
import { html, brut } from '../../outils/gabarit.mjs';
import { cheminLames, cheminAretes } from './iris.mjs';
import { externe } from './projet.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));
const mail = (c) => `mailto:${c.site.contact.email}`;

/* Diaphragme dessiné (première image de l'intro et icône du voile). */
export const iris = (classe, a = 58, rot = 0) => brut(`<svg class="${classe}" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
<path class="iris-lames" fill-rule="evenodd" d="${cheminLames(a, rot)}"/>
<path class="iris-aretes" d="${cheminAretes(a, rot)}"/>
<circle class="iris-bague" r="98.5"/>
</svg>`);

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const autres = c.alternatives(cle);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
${autres.length > 1 ? autres.map((a) => html`<link rel="alternate" hreflang="${a.l}" href="${c.abs(a.url)}">\n`) : ''}
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/images/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function entete(c) {
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo/logo-72.webp" alt="" width="36" height="36"><span>${c.site.nom}</span>
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${a ? html`<a class="bouton bouton--petit" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}" data-magnetique>${c.t('commun.actionEntete')}</a>` : ''}
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><span></span><span></span></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien', texte: html`<span class="menu-num" aria-hidden="true">0${i + 1}</span><span>${c.libelle(k)}</span>` })}</li>`)}</ul>
    <div class="menu-cote">
      <p><a class="bouton" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('accueil.hero.action')}</a></p>
      <p><a class="lien-fort" href="${mail(c)}">${c.site.contact.email}</a></p>
      <p class="menu-adresse">${c.site.contact.adresse}, ${c.site.contact.codePostal} ${c.site.contact.ville}</p>
      <p class="menu-reseaux">${externe(c, c.site.contact.instagram, c.s('commun.instagram'))} · ${externe(c, c.site.contact.facebook, c.s('commun.facebook'))}</p>
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  const k = c.site.contact;
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-haut">
    <p class="pied-mot" aria-hidden="true">${c.tb('commun.piedMot')}</p>
  </div>
  <div class="conteneur pied-grille">
    <div>
      <img class="pied-logo" src="/assets/images/logo/logo-144.webp" alt="Logo de PausePhoto65" width="72" height="72" loading="lazy">
      <p class="pied-titre">${c.site.nom}</p>
      <p>${k.adresse}<br>${k.codePostal} ${k.ville}<br><a href="${mail(c)}">${k.email}</a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((x) => html`<li>${c.lien(x)}</li>`)}<li>${c.lien('mentions-legales')}</li></ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.reseaux')}</p>
      <ul><li>${externe(c, k.instagram, c.s('commun.instagram'))}</li><li>${externe(c, k.facebook, c.s('commun.facebook'))}</li></ul>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="${mail(c)}">${c.t('commun.ecrire')}</a>
  <a class="bouton" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu">${iris('voile-iris', 30, 0)}<span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

/* Panneau d'intro : le diaphragme s'ouvre sur la photo d'ouverture de la page (page.intro). */
function ouverture(c) {
  const nom = c.page.intro || 'photos/regard-epaule';
  return html`<div class="ouverture-panneau" data-ouverture aria-hidden="true" data-gouttiere="${c.site.couleurs.ouverture}">
  <div class="iris" style="--flou:url(/assets/images/${nom}-flou.webp)">
    <div class="iris-photo"><img src="/assets/images/${nom}-640.webp" alt="" width="640" height="${Math.round(640 / (c.donnees['photos-infos'][nom] || { ratio: 0.6667 }).ratio)}" decoding="async"></div>
    ${iris('iris-svg', 58, 0)}
  </div>
  <p class="ouverture-nom">${c.site.nom}</p>
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-gabarit="${c.page.gabarit || c.page.cle}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
