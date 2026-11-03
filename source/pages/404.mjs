/* Page 404 : « Cette page est hors champ. », image de bokeh doré (rien de net). Une seule version. */
import { html } from '../../outils/gabarit.mjs';
import { photo } from '../gabarits/projet.mjs';

export const page = { cle: '404', fichier: '404', partage: false, intro: 'grok/bokeh-dore' };

export default (c) => html`
<section class="page-tete ecran introuvable" id="ouverture">
  <div class="page-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('introuvable.titre')}</h1>
    <p class="texte-large" data-anime="gsap" data-entree>${c.t('introuvable.texte')}</p>
    <p class="actions" data-anime="gsap" data-entree>${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} ${c.lien('galerie', { classe: 'lien-fleche', texte: c.t('introuvable.galerie') })}</p>
  </div>
  ${photo(c, { nom: 'grok/bokeh-dore', alt: '', cadrage: '50% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 92vw, 44vw', attrs: 'data-hero' })}
</section>
`;
