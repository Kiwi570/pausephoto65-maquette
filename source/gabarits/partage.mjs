/* Image de partage 1200×630 de chaque page (photo de PausePhoto65, logo, accroche, polices et couleurs du site).
   outils/images-partage.mjs photographie ces pages et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--fond);color:var(--texte)}
.carte-p{display:grid;grid-template-columns:1fr 470px;width:1200px;height:630px}
.carte-texte{display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px}
.carte-marque{display:flex;align-items:center;gap:18px;font:600 26px/1 var(--police-titres)}
.carte-marque img{width:72px;height:72px;border-radius:12px}
.carte-titre{font-family:var(--police-titres);font-weight:400;font-size:78px;line-height:1.02;margin:0;letter-spacing:-.01em;text-wrap:balance}
.carte-titre em{color:var(--accent);font-style:italic}
.carte-ligne{font-size:24px;margin:0;color:var(--texte-doux)}
.carte-image{background:center 30%/cover no-repeat;margin:28px 28px 28px 0;border-radius:6px}`)}</style>
</head><body>
<div class="carte-p">
  <div class="carte-texte">
    <p class="carte-marque"><img src="/assets/images/logo/logo-144.webp" alt="">${c.site.nom}</p>
    <p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p>
    <p class="carte-ligne">${c.t('commun.introLigne')}</p>
  </div>
  <div class="carte-image" style="background-image:url('/assets/images/${image}')"></div>
</div>
</body></html>`;
}
