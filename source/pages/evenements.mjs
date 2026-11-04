/* Événements : présence discrète, fil de la journée (plage de 4 h ou 8 h sur une journée type, exemple),
   quatre forfaits, petits plus, demande de date en quatre étapes avec récapitulatif. */
import { html } from '../../outils/gabarit.mjs';
import { photo, prix, sur, filEtapes, icones, bandeau } from '../gabarits/projet.mjs';

export const page = { cle: 'evenements', fichier: 'evenements', imagePartage: 'photos/bapteme-maman-bebe-eglise-1280.webp', intro: 'photos/bapteme-maman-bebe-eglise' };

const alt = (c, n) => c.donnees.alts[n.replace(/^photos\//, '')] || '';
const heure = (h) => `${Math.floor(h)} h${h % 1 ? ' ' + String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;

export default (c) => {
  const F = c.donnees.forfaits, J = c.donnees.journee;
  const debut = 8, fin = 24, pos = (h) => ((h - debut) / (fin - debut)) * 100;
  const types = [['mariage', F.filter((f) => f.type === 'mariage')], ['bapteme', F.filter((f) => f.type === 'bapteme')]];
  return html`
<section class="page-tete ecran" id="ouverture">
  <div class="page-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('evenements.titre')}</h1>
    <p class="texte-large" data-anime="gsap" data-entree>${c.t('evenements.texte')}</p>
    <p class="actions" data-anime="gsap" data-entree><a class="bouton" href="#demande" data-action-principale data-magnetique>${c.t('evenements.action')}</a> <span class="info-cle" data-info-cle>${c.t('evenements.info')}</span></p>
  </div>
  ${photo(c, { nom: 'photos/bapteme-maman-bebe-eglise', alt: alt(c, 'bapteme-maman-bebe-eglise'), cadrage: '50% 35%', cadrageMobile: '50% 35%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 92vw, 42vw', attrs: 'data-hero' })}
</section>

${bandeau(c.s('evenements.bandeau').split(' · '), 1)}

<section class="section approche" id="approche">
  <div class="conteneur approche-grille">
    <div class="approche-texte">
      ${sur(c.t('evenements.approche.sur'))}
      <h2 class="titre-section" data-anime>${c.t('evenements.approche.titre')}</h2>
      <blockquote class="citation citation--grande" data-anime><p>${'« ' + c.s('evenements.approche.citation') + ' »'}</p></blockquote>
      <p data-anime>${c.t('evenements.approche.texte')}</p>
    </div>
    <div class="approche-photos">
      ${photo(c, { nom: 'photos/salle-mariage-guirlandes', alt: alt(c, 'salle-mariage-guirlandes'), cadrage: '50% 40%', classe: 'approche-photo approche-photo--1', ratio: '2 / 3', sizes: '(max-width: 760px) 56vw, 24vw', attrs: 'data-parallaxe="-10"' })}
      ${photo(c, { nom: 'photos/eglise-bouquet-blanc', alt: alt(c, 'eglise-bouquet-blanc'), cadrage: '50% 70%', classe: 'approche-photo approche-photo--2', ratio: '2 / 3', sizes: '(max-width: 760px) 42vw, 17vw', attrs: 'data-parallaxe="12"' })}
    </div>
  </div>
</section>

<section class="section journee" id="journee" data-journee data-debut="${debut}" data-fin="${fin}">
  ${photo(c, { nom: 'grok/table-soir', alt: '', cadrage: '50% 50%', cadrageMobile: '50% 50%', classe: 'journee-fond', sizes: '100vw', mise: false })}
  <div class="conteneur journee-panneau">
    ${sur(c.t('evenements.journee.sur'))}
    <h2 class="titre-section" data-anime>${c.t('evenements.journee.titre')}</h2>
    <p data-anime>${c.t('evenements.journee.texte')}</p>
    <div class="journee-choix" role="group" aria-label="${c.s('evenements.forfaits.titre')}">
      <button type="button" class="puce-bouton" data-duree="4" aria-pressed="false">${c.t('evenements.journee.demi')}</button>
      <button type="button" class="puce-bouton" data-duree="8" aria-pressed="true">${c.t('evenements.journee.complete')}</button>
    </div>
    <div class="frise" data-frise>
      <div class="frise-axe" aria-hidden="true">
        ${[8, 12, 16, 20, 24].map((h) => html`<span class="frise-heure chiffres" style="left:${pos(h)}%">${h} h</span>`)}
      </div>
      <div class="frise-piste">
        <div class="frise-plage" data-frise-plage style="left:${pos(10)}%;width:${(8 / (fin - debut)) * 100}%" aria-hidden="true"></div>
        ${J.map((m) => html`<span class="frise-moment${m.heure >= 10 && m.heure <= 18 ? ' couvert' : ''}" data-heure="${m.heure}" data-repere style="left:${pos(m.heure)}%" aria-hidden="true"></span>`)}
      <label class="frise-curseur"><span class="visuellement-cache">${c.t('evenements.journee.debut')}</span><input type="range" min="${debut}" max="${fin - 4}" step="0.5" value="10" data-frise-debut aria-valuetext="10 h"></label>
      </div>
    </div>
    <div class="journee-bas">
      <p class="journee-plage"><span>${c.t('evenements.journee.plage')}</span> <strong class="chiffres" data-plage-texte>10 h – 18 h</strong></p>
      <div>
        <p class="petit-titre">${c.t('evenements.journee.couverts')}</p>
        <ul class="journee-moments" data-moments data-aucun="${c.s('evenements.journee.aucun')}">
          ${J.map((m) => html`<li data-heure="${m.heure}"${m.heure >= 10 && m.heure <= 18 ? '' : html` class="hors"`}><span class="chiffres">${heure(m.heure)}</span> <span>${m.nom}<span class="moment-hors"> · ${c.t('evenements.journee.hors')}</span></span></li>`)}
        </ul>
      </div>
    </div>
    <p class="note">${c.t('evenements.journee.exemple')}</p>
  </div>
</section>

<section class="section forfaits" id="forfaits">
  <div class="conteneur">
    <div class="tete-section tete-section--photo">
      <div>
        ${sur(c.t('evenements.forfaits.sur'))}
        <h2 class="titre-section" data-anime>${c.t('evenements.forfaits.titre')}</h2>
        <p data-anime>${c.t('evenements.forfaits.texte')}</p>
      </div>
      ${photo(c, { nom: 'photos/table-bapteme-dragees', alt: alt(c, 'table-bapteme-dragees'), cadrage: '50% 40%', classe: 'tete-photo', sizes: '(max-width: 760px) 92vw, 22vw' })}
    </div>
    <div class="forfaits-grille">
      ${types.map(([t, liste]) => html`<div class="forfaits-groupe">
        <h3 class="petit-titre">${c.t(`evenements.forfaits.${t}`)}</h3>
        <ul class="formules">${liste.map((f) => html`<li class="formule" id="forfait-${f.id}" data-anime>
          <h4>${f.nom}</h4>
          <p class="formule-ligne"><span>${f.duree}</span>${prix(f.prix, 'prix--grand')}</p>
          <ul class="coches">${f.inclus.map((x) => html`<li>${x}</li>`)}</ul>
          <a class="bouton bouton--contour" href="?forfait=${f.id}#demande" data-vers-demande data-forfait="${f.id}">${c.t('evenements.forfaits.demander')}</a>
        </li>`)}</ul>
      </div>`)}
    </div>
  </div>
</section>

<section class="section plus" id="plus">
  <div class="conteneur">
    <div class="plus-grille">
      <div>
        ${sur(c.t('evenements.plus.sur'))}
        <h2 class="titre-section" data-anime>${c.t('evenements.plus.titre')}</h2>
        <ol class="plus-liste">
          ${['groupe', 'coin', 'arche'].map((k, i) => html`<li class="plus-item" data-anime><span class="plus-num chiffres" aria-hidden="true">0${i + 1}</span><span>${c.t(`evenements.plus.${k}`)}</span></li>`)}
        </ol>
      </div>
      ${photo(c, { nom: 'photos/table-bapteme-panda', alt: alt(c, 'table-bapteme-panda'), cadrage: '50% 50%', classe: 'plus-media', ratio: '1 / 1', sizes: '(max-width: 760px) 92vw, 34vw' })}
    </div>
  </div>
</section>

<section class="section demande" id="demande">
  <div class="conteneur">
    <div class="tete-section tete-section--photo">
      <div>
        ${sur(c.t('evenements.demande.sur'))}
        <h2 class="titre-section">${c.t('evenements.demande.titre')}</h2>
        <p>${c.t('evenements.demande.texte')}</p>
      </div>
      ${photo(c, { nom: 'photos/famille-nouveau-ne-nb', alt: alt(c, 'famille-nouveau-ne-nb'), cadrage: '50% 18%', cadrageMobile: '50% 14%', classe: 'tete-photo', sizes: '(max-width: 760px) 92vw, 22vw' })}
    </div>
    <div class="parcours" data-parcours="demande">
      <form class="parcours-form" data-formulaire data-etapes action="#" novalidate data-remplir="${c.s('commun.aRemplir')}" data-choisir="${c.s('commun.aChoisir')}">
        ${filEtapes(c, ['evenements.demande.etape1', 'evenements.demande.etape2', 'evenements.demande.etape3', 'evenements.demande.etape4'])}
        <fieldset class="etape" data-etape="1">
          <legend class="etape-titre">${c.t('evenements.demande.etape1')}</legend>
          <div class="options options--2">
            ${['mariage', 'bapteme', 'anniversaire', 'autre'].map((t) => html`<label class="option"><input type="radio" name="evenement" value="${t}" required data-nom="${c.s(`evenements.demande.${t}`)}"><span class="option-nom">${c.t(`evenements.demande.${t}`)}</span></label>`)}
          </div>
          <p class="champ-erreur" data-erreur-etape aria-live="polite"></p>
          <div class="etape-nav"><button type="button" class="bouton" data-suivant>${c.t('evenements.demande.suivant')}</button></div>
        </fieldset>
        <fieldset class="etape" data-etape="2" hidden>
          <legend class="etape-titre">${c.t('evenements.demande.etape2')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="d-date">${c.t('evenements.demande.date')}</label><input id="d-date" name="date" type="date" required data-date-future data-message-passee="${c.s('evenements.demande.datePassee')}"></div>
            <div class="champ"><label for="d-commune">${c.t('evenements.demande.commune')}</label><input id="d-commune" name="commune" list="communes" autocomplete="address-level2" required></div>
          </div>
          <datalist id="communes">${c.donnees.communes.map((v) => html`<option value="${v.nom}"></option>`)}</datalist>
          <p class="champ-erreur" data-erreur-etape aria-live="polite"></p>
          <div class="etape-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('evenements.demande.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('evenements.demande.suivant')}</button></div>
        </fieldset>
        <fieldset class="etape" data-etape="3" hidden>
          <legend class="etape-titre">${c.t('evenements.demande.etape3')}</legend>
          <div class="options">
            ${F.map((f) => html`<label class="option" data-type="${f.type}"><input type="radio" name="forfait" value="${f.id}" required data-prix-valeur="${f.prix}" data-nom="${f.nom}"><span class="option-nom">${f.nom}</span><span class="option-detail">${f.duree} · ${prix(f.prix)}</span></label>`)}
          </div>
          <p class="champ-erreur" data-erreur-etape aria-live="polite"></p>
          <div class="etape-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('evenements.demande.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('evenements.demande.suivant')}</button></div>
        </fieldset>
        <fieldset class="etape" data-etape="4" hidden>
          <legend class="etape-titre">${c.t('evenements.demande.etape4')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="d-nom">${c.t('evenements.demande.nom')}</label><input id="d-nom" name="nom" autocomplete="family-name" required></div>
            <div class="champ"><label for="d-prenom">${c.t('evenements.demande.prenom')}</label><input id="d-prenom" name="prenom" autocomplete="given-name" required></div>
          </div>
          <div class="champ"><label for="d-email">${c.t('evenements.demande.email')}</label><input id="d-email" name="email" type="email" autocomplete="email" required></div>
          <div class="champ"><label for="d-tel">${c.t('evenements.demande.tel')}</label><input id="d-tel" name="tel" type="tel" autocomplete="tel"></div>
          <div class="champ"><label for="d-message">${c.t('evenements.demande.message')}</label><textarea id="d-message" name="message" rows="4"></textarea></div>
          <p class="mention-donnees">${c.tb('evenements.demande.donnees')}</p>
          <div class="etape-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('evenements.demande.precedent')}</button><button type="submit" class="bouton">${c.t('evenements.demande.envoyer')}</button></div>
          <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('evenements.demande.envoye')}"></p>
        </fieldset>
      </form>
      <aside class="recap" aria-label="${c.s('evenements.demande.recap')}" data-recap data-a-choisir="${c.s('evenements.demande.aChoisir')}">
        <p class="recap-titre">${c.t('evenements.demande.recap')}</p>
        <dl class="recap-liste" aria-live="polite">
          <div><dt>${c.t('evenements.demande.type')}</dt><dd data-recap-evenement>${c.t('evenements.demande.aChoisir')}</dd></div>
          <div><dt>${c.t('evenements.demande.date')}</dt><dd data-recap-date>${c.t('evenements.demande.aChoisir')}</dd></div>
          <div><dt>${c.t('evenements.demande.commune')}</dt><dd data-recap-commune>${c.t('evenements.demande.aChoisir')}</dd></div>
          <div class="recap-total"><dt>${c.t('evenements.demande.forfait')}</dt><dd data-recap-forfait data-prix>${c.t('evenements.demande.aChoisir')}</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>
`;
};
