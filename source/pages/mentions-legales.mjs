/* Mentions légales : fiche récapitulative à compléter, éditeur, hébergeur, crédits (illustrations générées),
   confidentialité. Barre de lecture et sommaire qui suit la lecture. */
import { html } from '../../outils/gabarit.mjs';
import { photo } from '../gabarits/projet.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/carnet-1168.webp', intro: 'grok/carnet', sansAction: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="ouverture">
  <div class="page-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('mentions.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}" data-anime="gsap" data-entree><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${photo(c, { nom: 'grok/carnet', alt: '', cadrage: '50% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-hero' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}"${s === 'fiche' ? html` class="fiche-client"` : ''}><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
