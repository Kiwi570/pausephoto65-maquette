/* Aides propres à PausePhoto65 pour les pages (source/pages/*.mjs). */
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, brut, texteBrut } from '../../outils/gabarit.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/* Photo avec sa version floue en fond (jamais de case vide) et, si demandé, la « mise au point »
   à son entrée dans l'écran (data-mise-au-point). Le reste est celui de c.media() du socle. */
export function photo(c, o) {
  const fig = texteBrut(c.media(o));
  const flou = `/assets/images/${o.nom}-flou.webp`;
  const attrs = [];
  if (existsSync(join(racine, 'assets/images', `${o.nom}-flou.webp`))) attrs.push(`--flou:url(${flou})`);
  let sortie = fig.replace('style="', `style="${attrs.join(';')};`);
  if (o.mise !== false) sortie = sortie.replace('<figure ', '<figure data-mise-au-point ');
  if (o.attrs) sortie = sortie.replace('<figure ', `<figure ${o.attrs} `);
  return brut(sortie);
}

/* Prix en euros (typographie française appliquée par le gabarit : espace fine dans les milliers). */
export const euros = (n) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/[\s\u202f\u00a0]/g, '\u00a0')}\u00a0€`;

export const prix = (n, classe = '') => html`<span class="prix ${classe}" data-prix>${euros(n)}</span>`;

/* Petit titre au-dessus d'un titre de section. */
export const sur = (texte) => html`<p class="sur"><span class="sur-trait" aria-hidden="true"></span>${texte}</p>`;

/* Lien externe : nouvel onglet, annoncé aux lecteurs d'écran. */
export const externe = (c, href, texte, classe = '') => html`<a href="${href}" target="_blank" rel="noopener"${classe ? brut(` class="${classe}"`) : ''}>${texte}<span class="visuellement-cache"> ${c.s('commun.nouvelOnglet')}</span></a>`;

/* Icônes (traits simples, couleur du texte). */
export const icones = {
  fleche: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
  gauche: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
  droite: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'),
  croix: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'),
  plus: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'),
};

/* Largeurs disponibles d'une image (assets/images/<nom>-<largeur>.webp), pour la visionneuse. */
export function largeurs(nom) {
  const dossier = join(racine, 'assets/images', dirname(nom));
  const base = nom.split('/').pop();
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier).map((f) => f.match(new RegExp(`^${base}-(\\d+)\\.webp$`))).filter(Boolean).map((m) => +m[1]).sort((a, b) => a - b);
}

/* Citation entre guillemets français : les espaces insécables sont posées par le gabarit. */
export const citation = (c, cle, classe = '') => html`<blockquote class="citation ${classe}" data-anime><p>${'« ' + c.s(cle) + ' »'}</p></blockquote>`;

/* Fil des étapes d'un parcours : numéro + nom ; au téléphone, seul le nom de l'étape en cours est écrit. */
export function filEtapes(c, cles) {
  return html`<ol class="etapes-fil" aria-hidden="true">${cles.map((k, i) => html`<li${i ? '' : html` class="actif"`}><span class="etape-num chiffres">${i + 1}</span><span class="etape-nom">${c.s(k).replace(/^\d+\.\s*/, '')}</span></li>`)}</ol>`;
}
