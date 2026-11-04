/* Galerie : trois salles qui défilent à l'horizontale (épinglées sur ordinateur, glissées au doigt sur téléphone),
   filtres gardés dans l'adresse (?univers=), visionneuse plein écran : chaque photo entière, un lien par photo. */
import { html, brut, typo } from '../../outils/gabarit.mjs';
import { photo, sur, icones, largeurs, bandeau } from '../gabarits/projet.mjs';

export const page = { cle: 'galerie', fichier: 'galerie', imagePartage: 'photos/studio-lumiere-fenetre-1280.webp', intro: 'photos/studio-lumiere-fenetre' };

export default (c) => {
  const g = c.donnees.galerie;
  const n = g.length;
  const mosaique = ['studio-lumiere-fenetre', 'lisbonne-pont-portrait', 'creatrice-atelier', 'coquelicots-chapeau-dos', 'oeil-chat'];
  return html`
<section class="galerie-tete ecran" id="ouverture">
  <div class="galerie-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('galerie.titre')}</h1>
    <p class="texte-large" data-anime="gsap" data-entree>${c.t('galerie.texte', { n })}</p>
    <div class="filtres" role="group" aria-label="${c.s('galerie.filtres')}" data-filtres data-anime="gsap" data-entree>
      <button type="button" class="filtre" data-filtre="tous" aria-pressed="true">${c.t('galerie.tous')} <span class="filtre-n chiffres">${n}</span></button>
      ${c.donnees.univers.map((u) => html`<button type="button" class="filtre" data-filtre="${u.id}" aria-pressed="false">${u.court} <span class="filtre-n chiffres">${g.filter((x) => x.univers === u.id).length}</span></button>`)}
    </div>
    <p class="actions" data-anime="gsap" data-entree><a class="bouton" href="${c.url('seances', 'reservation')}" data-libelle="${c.libelle('seances')}" data-action-principale data-magnetique>${c.t('galerie.action')}</a> <span class="info-cle" data-info-cle>${c.t('galerie.info', { n })}</span></p>
  </div>
  <div class="mosaique" data-visuel data-manipuler>
    <p class="pluie-indice pluie-indice--mosaique" aria-hidden="true" data-audit-ignorer>${c.t('galerie.indice')}</p>
    ${mosaique.map((m, i) => photo(c, { nom: 'photos/' + m, alt: c.donnees.alts[m], cadrage: '50% 35%', classe: `mosaique-photo mosaique-photo--${i + 1}`, priorite: i === 0, sizes: '(max-width: 760px) 44vw, 22vw', attrs: i === 0 ? 'data-hero' : '' }))}
  </div>
</section>

${bandeau(c.s('galerie.bandeau').split(' · '), -1)}

${c.donnees.univers.map((u, k) => {
  const photos = g.filter((x) => x.univers === u.id);
  return html`<section class="salle ecran epingle" id="${u.id}" data-salle="${u.id}" data-entete-cache style="--teinte:${photos[0].couleur}">
  <div class="salle-tete conteneur">
    <p class="salle-num chiffres" aria-hidden="true">0${k + 1}</p>
    <h2 class="salle-titre">${u.titre}</h2>
    <p class="salle-texte">${u.texte} <span class="salle-n">${photos.length} ${c.t('galerie.photos')}</span></p>
  </div>
  <div class="piste salle-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('galerie.region', { u: u.court })}">
    ${photos.map((p) => html`<a class="cadre" id="photo-${p.id}" href="#photo-${p.id}" data-photo="${p.id}" data-couleur="${p.couleur}" style="--r:${p.ratio}" data-sans-transition aria-label="${c.s('galerie.ouvrir')} : ${p.alt}">
      ${photo(c, { nom: p.photo, alt: p.alt, cadrage: '50% 50%', classe: 'cadre-media', sizes: '(max-width: 760px) 70vw, 40vh' })}
    </a>`)}
  </div>
  <div class="salle-pied conteneur">
    <div class="galerie-progres" aria-hidden="true"><span></span></div>
    <p class="indice-glisser" aria-hidden="true">${c.t('commun.glisser')} ${icones.fleche}</p>
  </div>
</section>`;
})}

<section class="section fin" id="fin">
  <div class="conteneur fin-grille">
    <div>
      <h2 class="titre-fin" data-anime>${c.t('galerie.finTitre')}</h2>
      <p class="texte-large" data-anime>${c.t('galerie.finTexte')}</p>
      <p class="actions" data-anime>
        <a class="bouton" href="${c.url('seances', 'reservation')}" data-libelle="${c.libelle('seances')}">${c.t('galerie.finReserver')}</a>
        ${c.lien('a-propos', { ancre: 'contact', classe: 'lien-fleche', texte: html`${c.t('galerie.finEcrire')} ${icones.fleche}` })}
      </p>
    </div>
    ${photo(c, { nom: 'photos/studio-blouson-cuir-assise', alt: c.donnees.alts['studio-blouson-cuir-assise'], cadrage: '50% 40%', classe: 'fin-media', ratio: '4 / 5', sizes: '(max-width: 760px) 92vw, 40vw' })}
  </div>
</section>

<div class="visionneuse" id="visionneuse" data-visionneuse data-recouvrement role="dialog" aria-modal="true" aria-label="${c.s('galerie.visionneuse')}" hidden inert>
  <div class="visionneuse-scene" data-visionneuse-scene>
    <img class="visionneuse-image" data-visionneuse-image alt="">
  </div>
  <p class="visionneuse-legende"><span class="visionneuse-alt" data-visionneuse-alt></span> <span class="visionneuse-pos chiffres" data-visionneuse-pos></span></p>
  <button type="button" class="visionneuse-bouton visionneuse-fermer" data-visionneuse-fermer aria-label="${c.s('galerie.fermer')}">${icones.croix}</button>
  <button type="button" class="visionneuse-bouton visionneuse-prec" data-visionneuse-prec aria-label="${c.s('galerie.precedente')}">${icones.gauche}</button>
  <button type="button" class="visionneuse-bouton visionneuse-suiv" data-visionneuse-suiv aria-label="${c.s('galerie.suivante')}">${icones.droite}</button>
</div>
<script type="application/json" id="galerie-donnees">${brut(JSON.stringify(g.map((p) => { const ws = largeurs(p.photo); const w = ws.find((x) => x >= 1280) || ws[ws.length - 1]; return { id: p.id, u: p.univers, src: `/assets/images/${p.photo}-${w}.webp`, srcset: ws.map((x) => `/assets/images/${p.photo}-${x}.webp ${x}w`).join(', '), alt: typo(p.alt), r: p.ratio }; })).replace(/</g, '\\u003c'))}</script>
`;
};
