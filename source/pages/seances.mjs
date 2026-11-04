/* Séances & tarifs : guide « Quelle séance pour moi ? » (bague de mise au point), séances d'une heure,
   séance Renaissance, saisons (statut calculé à la date du jour), studio, réservation simulée en trois étapes, FAQ. */
import { html } from '../../outils/gabarit.mjs';
import { photo, prix, euros, sur, filEtapes, icones, bandeau } from '../gabarits/projet.mjs';

export const page = { cle: 'seances', fichier: 'seances', imagePartage: 'photos/studio-robe-noire-sourire-1280.webp', intro: 'photos/studio-robe-noire-sourire' };

const alt = (c, n) => c.donnees.alts[n.replace(/^photos\//, '')] || '';

export default (c) => {
  const S = c.donnees.seances, R = c.donnees.renaissance;
  const printemps = c.donnees.saisons.find((s) => s.id === 'printemps');
  /* Choix du guide : pour qui → séance. */
  const choix = ['solo', 'duo', 'famille', 'pro', 'renaissance'].map((id) => ({ id, libelle: c.s(`seances.guide.choix.${id}`), seance: id }));
  const toutes = [
    ...S.map((s) => ({ id: s.id, nom: s.nom, duree: s.duree, prix: s.prix })),
    ...R.map((r) => ({ id: r.id, nom: r.nom, duree: r.duree, prix: r.prix })),
    { id: 'printemps', nom: printemps.nom, duree: c.s('commun.heure'), prix: printemps.prix, saison: true },
  ];
  return html`
<section class="page-tete ecran" id="ouverture">
  <div class="page-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('seances.titre')}</h1>
    <p class="texte-large" data-anime="gsap" data-entree>${c.t('seances.texte')}</p>
    <p class="actions" data-anime="gsap" data-entree><a class="bouton" href="#reservation" data-action-principale data-magnetique>${c.t('seances.action')}</a> <span class="info-cle" data-info-cle>${c.t('seances.info')}</span></p>
  </div>
  ${photo(c, { nom: 'photos/studio-robe-noire-sourire', alt: alt(c, 'studio-robe-noire-sourire'), cadrage: '50% 30%', cadrageMobile: '50% 25%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 92vw, 42vw', attrs: 'data-hero' })}
</section>

${bandeau(c.s('seances.bandeau').split(' · '), -1)}

<section class="section guide" id="guide" data-guide>
  <div class="conteneur guide-grille">
    <div class="guide-texte">
      ${sur(c.t('seances.guide.sur'))}
      <h2 class="titre-section" data-anime>${c.t('seances.guide.titre')}</h2>
      <p data-anime>${c.t('seances.guide.texte')}</p>
      <fieldset class="choix" data-anime>
        <legend>${c.t('seances.guide.qui')}</legend>
        <div class="choix-liste">${choix.map((x, i) => html`<label class="puce"><input type="radio" name="guide-qui" value="${x.seance}"${i === 0 ? html` checked` : ''}><span>${x.libelle}</span></label>`)}</div>
      </fieldset>
      <fieldset class="choix" data-anime>
        <legend>${c.t('seances.guide.ou')}</legend>
        <div class="choix-liste">
          <label class="puce"><input type="radio" name="guide-ou" value="studio" checked><span>${c.t('seances.guide.studio')}</span></label>
          <label class="puce"><input type="radio" name="guide-ou" value="exterieur"><span>${c.t('seances.guide.exterieur')}</span></label>
          <label class="puce"><input type="radio" name="guide-ou" value="indifferent"><span>${c.t('seances.guide.indifferent')}</span></label>
        </div>
      </fieldset>
    </div>
    <div class="guide-visuel">
      <div class="bague" data-bague>
        <div class="bague-fond" aria-hidden="true"></div>
        <svg class="bague-svg" viewBox="-110 -110 220 220" aria-hidden="true" focusable="false">
          <circle class="bague-anneau" r="96"/>
          <g class="bague-graduations" data-bague-graduations>${Array.from({ length: 60 }, (_, i) => html`<line x1="0" y1="${i % 5 ? -84 : -78}" x2="0" y2="-92" transform="rotate(${i * 6})"/>`)}</g>
          <path class="bague-repere" d="M0 -104 L7 -114 L-7 -114 Z"/>
          <circle class="bague-centre" r="60"/>
        </svg>
        <div class="bague-resultat" data-guide-resultat aria-live="polite">
          <p class="bague-sur">${c.t('seances.guide.resultat')}</p>
          ${toutes.filter((t) => !t.saison && t.id !== 'transformation').map((t, i) => html`<div class="bague-choix" data-guide-pour="${t.id}"${i ? html` hidden` : ''}>
            <p class="bague-nom">${t.nom}</p>
            <p class="bague-prix">${t.id === 'renaissance' ? html`${c.t('commun.des')} ` : ''}${prix(t.prix)} · ${t.duree}</p>
          </div>`)}
        </div>
      </div>
      <p class="guide-lieu" data-guide-lieu data-studio="${c.s('seances.guide.lieuStudio')}" data-exterieur="${c.s('seances.guide.lieuExterieur')}" data-indifferent="${c.s('seances.guide.lieuIndifferent')}">${c.t('seances.guide.lieuStudio')}</p>
      <p><a class="bouton" href="?seance=solo#reservation" data-guide-lien data-vers-reservation>${c.t('seances.guide.reserver')}</a></p>
    </div>
  </div>
</section>

<section class="section seances-heure" id="seances-heure">
  <div class="conteneur">
    <div class="tete-section">
      ${sur(c.t('seances.heure.sur'))}
      <h2 class="titre-section" data-anime>${c.t('seances.heure.titre')}</h2>
      <p data-anime>${c.t('seances.heure.texte')}</p>
    </div>
    <ul class="fiches">
      ${S.map((s) => html`<li class="fiche" id="seance-${s.id}" data-anime data-inclinaison>
        ${photo(c, { nom: s.photo, alt: alt(c, s.photo), cadrage: s.cadrage, classe: 'fiche-media', ratio: '4 / 5', sizes: '(max-width: 760px) 86vw, 24vw' })}
        <div class="fiche-corps">
          <h3>${s.nom}</h3>
          <p class="fiche-pour">${s.pour}</p>
          <p class="fiche-ligne"><span>${s.duree}</span>${prix(s.prix, 'prix--grand')}</p>
          <p class="fiche-inclus">${s.inclus}</p>
          <a class="bouton bouton--contour" href="?seance=${s.id}#reservation" data-vers-reservation data-seance="${s.id}">${c.t('commun.fiche')}</a>
        </div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="section renaissance" id="renaissance">
  <div class="conteneur">
    <div class="renaissance-grille">
      <div class="renaissance-texte">
        ${sur(c.t('seances.renaissance.sur'))}
        <h2 class="titre-section" data-anime>${c.t('seances.renaissance.titre')}</h2>
        <p class="texte-large" data-anime>${c.t('seances.renaissance.texte')}</p>
        <h3 class="petit-titre" data-anime>${c.t('seances.renaissance.deroule')}</h3>
        <ol class="deroule" data-deroule>
          ${[1, 2, 3, 4].map((i) => html`<li data-anime><span class="deroule-num chiffres" aria-hidden="true">0${i}</span>${c.t(`seances.renaissance.etape${i}`)}</li>`)}
        </ol>
      </div>
      <div class="renaissance-photos">
        ${photo(c, { nom: 'grok/loge-maquillage', alt: '', cadrage: '50% 50%', classe: 'renaissance-photo renaissance-photo--1', ratio: '2 / 3', sizes: '(max-width: 760px) 54vw, 22vw', attrs: 'data-parallaxe="-10"' })}
        ${photo(c, { nom: 'photos/chaise-lumiere-fenetre', alt: alt(c, 'chaise-lumiere-fenetre'), cadrage: '50% 30%', classe: 'renaissance-photo renaissance-photo--2', ratio: '3 / 4', sizes: '(max-width: 760px) 50vw, 20vw', attrs: 'data-parallaxe="8"' })}
        ${photo(c, { nom: 'photos/blouson-cuir-debout', alt: alt(c, 'blouson-cuir-debout'), cadrage: '50% 30%', classe: 'renaissance-photo renaissance-photo--3', ratio: '3 / 4', sizes: '(max-width: 760px) 44vw, 16vw', attrs: 'data-parallaxe="-16"' })}
      </div>
    </div>
    <ul class="formules">
      ${R.map((r) => html`<li class="formule" data-anime>
        <h3>${r.nom}</h3>
        <p class="formule-ligne"><span>${r.duree}</span>${prix(r.prix, 'prix--grand')}</p>
        <ul class="coches">${r.inclus.map((x) => (x.startsWith('**') ? html`<li><strong>${x.slice(2, -2)}</strong></li>` : html`<li>${x}</li>`))}</ul>
        <a class="bouton" href="?seance=${r.id}#reservation" data-vers-reservation data-seance="${r.id}">${c.t('seances.renaissance.reserver')}</a>
      </li>`)}
    </ul>
  </div>
</section>

<section class="section saisons" id="saisons">
  <div class="conteneur">
    <div class="tete-section">
      ${sur(c.t('seances.saisons.sur'))}
      <h2 class="titre-section" data-anime>${c.t('seances.saisons.titre')}</h2>
      <p data-anime>${c.t('seances.saisons.texte')}</p>
    </div>
    <ul class="saisons-liste" data-statuts data-ouvert="${c.s('seances.saisons.ouvert')}" data-avenir="${c.s('seances.saisons.avenir')}" data-clos="${c.s('seances.saisons.clos')}" data-inconnu="${c.s('seances.saisons.inconnu')}">
      ${c.donnees.saisons.map((s) => html`<li class="saison" data-anime data-saison="${s.id}"${s.debut ? html` data-debut="${s.debut}" data-fin="${s.fin}"` : ''}>
        ${photo(c, { nom: s.photo, alt: alt(c, s.photo), cadrage: s.cadrage, classe: 'saison-media', ratio: '4 / 5', sizes: '(max-width: 760px) 70vw, 18vw' })}
        <h3>${s.nom}</h3>
        <p class="saison-detail">${s.prix ? html`${prix(s.prix)} · ` : ''}${s.detail}${s.periode ? html`<br>${s.periode}` : ''}</p>
        <p class="tirage-statut" data-statut></p>
        ${s.debut ? html`<a class="lien-fleche" href="?seance=${s.id}#reservation" data-vers-reservation data-seance="${s.id}" data-si-ouvert hidden>${c.t('seances.saisons.reserver')} ${icones.fleche}</a>` : ''}
      </li>`)}
    </ul>
  </div>
</section>

<section class="section studio" id="studio">
  <div class="conteneur deux-colonnes">
    ${photo(c, { nom: 'photos/studio-nb-assise-sol', alt: alt(c, 'studio-nb-assise-sol'), cadrage: '50% 50%', cadrageMobile: '50% 50%', classe: 'studio-media', ratio: '3 / 2', sizes: '(max-width: 760px) 92vw, 48vw' })}
    <div>
      ${sur(c.t('seances.studio.sur'))}
      <h2 class="titre-section" data-anime>${c.t('seances.studio.titre')}</h2>
      <p data-anime>${c.t('seances.studio.texte')}</p>
      <p data-anime>${c.lien('a-propos', { ancre: 'zone', classe: 'lien-fleche', texte: html`${c.t('seances.studio.lien')} ${icones.fleche}` })}</p>
    </div>
  </div>
</section>

<section class="section reservation" id="reservation">
  <div class="conteneur">
    <div class="tete-section tete-section--photo">
      <div>
        ${sur(c.t('seances.reservation.sur'))}
        <h2 class="titre-section">${c.t('seances.reservation.titre')}</h2>
        <p>${c.t('seances.reservation.texte')}</p>
      </div>
      ${photo(c, { nom: 'photos/studio-assise-fond-blanc', alt: alt(c, 'studio-assise-fond-blanc'), cadrage: '50% 50%', cadrageMobile: '50% 22%', classe: 'tete-photo', sizes: '(max-width: 760px) 92vw, 22vw' })}
    </div>
    <div class="parcours" data-parcours="reservation">
      <form class="parcours-form" data-formulaire data-etapes action="#" novalidate data-remplir="${c.s('commun.aRemplir')}" data-choisir="${c.s('commun.aChoisir')}">
        ${filEtapes(c, ['seances.reservation.etape1', 'seances.reservation.etape2', 'seances.reservation.etape3'])}
        <fieldset class="etape" data-etape="1">
          <legend class="etape-titre">${c.t('seances.reservation.etape1')}</legend>
          <div class="options">
            ${toutes.map((t) => html`<label class="option" data-option="${t.id}"><input type="radio" name="seance" value="${t.id}" required data-prix-valeur="${t.prix}" data-nom="${t.nom}"><span class="option-nom">${t.nom}</span><span class="option-detail">${t.duree} · ${euros(t.prix)}</span>${t.saison ? html`<span class="option-statut" data-statut-option data-debut="${printemps.debut}" data-fin="${printemps.fin}"></span>` : ''}</label>`)}
          </div>
          <p class="champ-erreur" data-erreur-etape aria-live="polite"></p>
          <div class="etape-nav"><button type="button" class="bouton" data-suivant>${c.t('seances.reservation.suivant')}</button></div>
        </fieldset>
        <fieldset class="etape" data-etape="2" hidden>
          <legend class="etape-titre">${c.t('seances.reservation.etape2')}</legend>
          <div class="calendrier" data-calendrier data-precedent="${c.s('seances.reservation.moisPrecedent')}" data-suivant="${c.s('seances.reservation.moisSuivant')}" data-aujourdhui="${c.s('seances.reservation.aujourdhui')}"></div>
          <input type="hidden" name="jour" value="" required data-jour>
          <fieldset class="creneaux">
            <legend>${c.t('seances.reservation.creneau')}</legend>
            <div class="choix-liste">${[['10:00', '10 h'], ['14:00', '14 h'], ['16:30', '16 h 30']].map(([h, l]) => html`<label class="puce"><input type="radio" name="creneau" value="${h}" data-libelle-creneau="${l}"><span class="chiffres">${l}</span></label>`)}</div>
            <p class="note">${c.t('seances.reservation.creneauxNote')}</p>
          </fieldset>
          <p class="champ-erreur" data-erreur-etape aria-live="polite" data-message-jour="${c.s('seances.reservation.choisirJour')}" data-message-creneau="${c.s('seances.reservation.choisirCreneau')}"></p>
          <div class="etape-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('seances.reservation.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('seances.reservation.suivant')}</button></div>
        </fieldset>
        <fieldset class="etape" data-etape="3" hidden>
          <legend class="etape-titre">${c.t('seances.reservation.etape3')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="r-nom">${c.t('seances.reservation.nom')}</label><input id="r-nom" name="nom" autocomplete="family-name" required></div>
            <div class="champ"><label for="r-prenom">${c.t('seances.reservation.prenom')}</label><input id="r-prenom" name="prenom" autocomplete="given-name" required></div>
          </div>
          <div class="champ"><label for="r-email">${c.t('seances.reservation.email')}</label><input id="r-email" name="email" type="email" autocomplete="email" required></div>
          <div class="champ"><label for="r-tel">${c.t('seances.reservation.tel')}</label><input id="r-tel" name="tel" type="tel" autocomplete="tel"></div>
          <div class="champ"><label for="r-message">${c.t('seances.reservation.message')}</label><textarea id="r-message" name="message" rows="4"></textarea></div>
          <p class="mention-donnees">${c.tb('seances.reservation.donnees')}</p>
          <div class="etape-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('seances.reservation.precedent')}</button><button type="submit" class="bouton">${c.t('seances.reservation.envoyer')}</button></div>
          <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('seances.reservation.envoye')}"></p>
        </fieldset>
      </form>
      <aside class="recap" aria-label="${c.s('seances.reservation.recap')}" data-recap>
        <p class="recap-titre">${c.t('seances.reservation.recap')}</p>
        <dl class="recap-liste" aria-live="polite">
          <div><dt>${c.t('seances.reservation.seance')}</dt><dd data-recap-seance>${c.t('seances.reservation.recapVide')}</dd></div>
          <div><dt>${c.t('seances.reservation.jour')}</dt><dd data-recap-jour>${c.t('seances.reservation.aucunJour')}</dd></div>
          <div><dt>${c.t('seances.reservation.creneau')}</dt><dd data-recap-creneau>${c.t('seances.reservation.aucunCreneau')}</dd></div>
          <div class="recap-total"><dt>${c.t('seances.reservation.total')}</dt><dd class="chiffres" data-recap-total data-prix>—</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>

<section class="section faq" id="faq">
  <div class="conteneur faq-grille">
    <div>
      ${sur(c.t('seances.faq.sur'))}
      <h2 class="titre-section" data-anime>${c.t('seances.faq.titre')}</h2>
      ${c.donnees.faq.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}<span class="faq-plus" aria-hidden="true">${icones.plus}</span></summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
    </div>
    ${photo(c, { nom: 'photos/detail-baskets', alt: alt(c, 'detail-baskets'), cadrage: '50% 50%', classe: 'faq-media', ratio: '4 / 5', sizes: '(max-width: 760px) 92vw, 34vw' })}
  </div>
</section>

<section class="section fin" id="fin">
  <div class="conteneur fin-grille">
    <div>
      <h2 class="titre-fin" data-anime>${c.t('seances.fin.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('seances.fin.texte')}</p>
      <p class="actions" data-anime>
        ${c.lien('a-propos', { ancre: 'contact', classe: 'bouton', texte: c.t('seances.fin.ecrire') })}
        ${c.lien('galerie', { classe: 'lien-fleche', texte: html`${c.t('seances.fin.galerie')} ${icones.fleche}` })}
      </p>
    </div>
    ${photo(c, { nom: 'photos/studio-blouson-cuir-assise', alt: alt(c, 'studio-blouson-cuir-assise'), cadrage: '50% 45%', classe: 'fin-media', ratio: '4 / 5', sizes: '(max-width: 760px) 92vw, 40vw' })}
  </div>
</section>
`;
};
