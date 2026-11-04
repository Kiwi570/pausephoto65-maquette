/* Accueil : ouverture en diaphragme, Pause/Pose, planche contact, séances, événements, saisons,
   la photographe, la lumière du jour, appel final. */
import { html } from '../../outils/gabarit.mjs';
import { photo, prix, euros, sur, icones, citation, bandeau } from '../gabarits/projet.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'photos/regard-epaule-1280.webp', intro: 'photos/regard-epaule' };

const alt = (c, n) => c.donnees.alts[n.replace(/^photos\//, '')] || '';

/* Pluie de tirages du premier écran : [photo, cadrage, ordinateur [x %, y %, rotation, taille], téléphone [x, y, rotation, petit écran] ou rien]. */
const PLUIE = [
  ['regard-epaule', '50% 35%', [9, 26, -9, 1.15], [14, 14, -8, 1]],
  ['coquelicots-chapeau-sourire', '50% 30%', [22, 11, 6, 0.9], null],
  ['studio-blouson-cuir-main', '50% 30%', [79, 12, -6, 0.95], [86, 14, 7, 1]],
  ['famille-maman-bebe-canape', '50% 35%', [92, 34, 8, 1.1], null],
  ['printemps-colza-champ', '50% 40%', [7, 68, 7, 1], [11, 87, 6]],
  ['blazer-sourire', '50% 30%', [21, 89, -6, 0.95], [50, 91, -4]],
  ['bapteme-maman-bebe-eglise', '50% 35%', [85, 72, -8, 1.05], [89, 86, -7]],
  ['lisbonne-pont-portrait', '40% 40%', [96, 92, 5, 0.85], null],
  ['automne-foret-debout', '50% 30%', [68, 94, 9, 0.8], null],
  ['creatrice-cadre-coeur', '50% 40%', [36, 95, -4, 0.75], [50, 12, 4]],
];

const PLANCHE = [
  ['studio-blouson-cuir-main', 'portraits'], ['studio-dos-noir'], ['bapteme-maman-bebe-eglise'], ['lisbonne-rocher', 'regard'],
  ['cote-brume'], ['crepuscule-mer'], ['blazer-sourire', 'pro'], ['creatrice-atelier'],
  ['studio-carte-soleil'], ['eglise-bouquet-blanc'], ['printemps-colza-fleur'], ['automne-foret-debout'],
];

export default (c) => {
  const univers = Object.fromEntries(c.donnees.univers.map((u) => [u.id, u]));
  return html`
<section class="hero hero--pluie ecran" id="ouverture" data-pluie>
  <div class="pluie" aria-hidden="true" data-audit-ignorer>
    ${PLUIE.map(([n, cad, d, m], i) => html`<div class="pluie-tirage" style="--x:${d[0]}%;--y:${d[1]}%;--r:${d[2]}deg;--w:${d[3]}${m ? html`;--xm:${m[0]}%;--ym:${m[1]}%;--rm:${m[2]}deg` : ''}"${m ? html` data-m${m[3] ? html` data-m-petit` : ''}` : ''}><figure class="pluie-cadre" style="--cadrage:${cad}"><img src="/assets/images/photos/${n}-640.webp" alt="" width="640" height="${Math.round(640 / c.donnees['photos-infos']['photos/' + n].ratio)}" decoding="async" draggable="false"${i > 5 ? html` loading="lazy"` : ''}></figure></div>`)}
    <p class="pluie-indice">${c.t('accueil.hero.indice')}</p>
  </div>
  <div class="hero-centre">
    <p class="sur hero-sur" data-anime="gsap" data-entree><span class="sur-trait" aria-hidden="true"></span>${c.t('commun.introLigne')}</p>
    <h1 class="hero-titre" data-superpose><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--accent" data-anime="gsap">${c.t('accueil.hero.titre2')}</span></span></h1>
    <div class="hero-cote" data-anime="gsap">
      <p class="hero-texte">${c.t('accueil.hero.texte')}</p>
      <p class="hero-actions">
        <a class="bouton" href="${c.url('seances', 'reservation')}" data-libelle="${c.libelle('seances')}" data-action-principale data-magnetique>${c.t('accueil.hero.action')}</a>
        ${c.lien('galerie', { classe: 'lien-fleche', texte: html`${c.t('accueil.hero.galerie')} ${icones.fleche}` })}
      </p>
      <p class="hero-info" data-info-cle>${c.t('accueil.hero.info')}</p>
    </div>
  </div>
</section>

${bandeau(c.s('accueil.bandeau1').split(' · '), -1)}

<section class="section manifeste" id="pause-pose">
  <div class="conteneur manifeste-grille">
    <div class="manifeste-texte">
      ${sur(c.t('accueil.manifeste.sur'))}
      <h2 class="titre-section" data-anime>${c.t('accueil.manifeste.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('accueil.manifeste.texte')}</p>
      ${citation(c, 'accueil.manifeste.citation')}
      <p data-anime>${c.lien('a-propos', { ancre: 'facon', classe: 'lien-fleche', texte: html`${c.t('accueil.manifeste.lien')} ${icones.fleche}` })}</p>
    </div>
    <div class="manifeste-visuel">
      <canvas class="mot-pause" data-mot-pause aria-hidden="true" data-audit-ignorer width="600" height="240"></canvas>
      <div class="manifeste-photos">
        ${photo(c, { nom: 'photos/studio-pouf-pull-gris', alt: alt(c, 'studio-pouf-pull-gris'), cadrage: '50% 35%', classe: 'manifeste-photo manifeste-photo--1', ratio: '3 / 4', sizes: '(max-width: 760px) 56vw, 22vw', attrs: 'data-parallaxe="-8"' })}
        ${photo(c, { nom: 'photos/coquelicots-chapeau-sourire', alt: alt(c, 'coquelicots-chapeau-sourire'), cadrage: '50% 30%', classe: 'manifeste-photo manifeste-photo--2', ratio: '3 / 4', sizes: '(max-width: 760px) 46vw, 18vw', attrs: 'data-parallaxe="10"' })}
        ${photo(c, { nom: 'photos/studio-robe-satin-dos', alt: alt(c, 'studio-robe-satin-dos'), cadrage: '50% 30%', classe: 'manifeste-photo manifeste-photo--3', ratio: '4 / 5', sizes: '(max-width: 760px) 42vw, 16vw', attrs: 'data-parallaxe="-14"' })}
      </div>
    </div>
  </div>
</section>

<section class="section regards" id="trois-regards">
  <div class="conteneur regards-tete">
    ${sur(c.t('accueil.regards.sur'))}
    <h2 class="titre-section" data-anime>${c.t('accueil.regards.titre')}</h2>
    <p data-anime>${c.t('accueil.regards.texte')}</p>
  </div>
  <div class="conteneur">
    <ol class="planche" data-planche data-superpose>
      ${PLANCHE.map(([n, u], i) => {
        const num = String(i + 12).padStart(2, '0');
        const vue = photo(c, { nom: 'photos/' + n, alt: u ? '' : alt(c, n), cadrage: '50% 35%', classe: 'vue-media', ratio: '2 / 3', sizes: '(max-width: 760px) 30vw, 15vw', mise: false });
        return u
          ? html`<li class="vue vue--choisie"><span class="vue-num" aria-hidden="true">${num}</span><a class="vue-lien" href="${c.url('galerie', u)}" data-libelle="${c.libelle('galerie')}"><span class="vue-cadre">${vue}<svg class="vue-cercle" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M50 4C80 3 97 30 96 74c-1 44-18 72-48 72C19 146 3 118 4 75 5 33 20 6 52 5c9 0 17 3 22 7" pathLength="1"/></svg></span><span class="vue-legende">${univers[u].titre} <span class="vue-voir">${c.t('accueil.regards.voir')} ${icones.fleche}</span></span></a></li>`
          : html`<li class="vue"><span class="vue-num" aria-hidden="true">${num}</span>${vue}</li>`;
      })}
    </ol>
  </div>
</section>

<section class="section seances-accueil" id="seances">
  <div class="conteneur">
    <div class="tete-section">
      ${sur(c.t('accueil.seances.sur'))}
      <h2 class="titre-section" data-anime>${c.t('accueil.seances.titre')}</h2>
      <p data-anime>${c.t('accueil.seances.texte')}</p>
    </div>
    <ul class="cartes-seances">
      ${c.donnees.seances.map((s) => html`<li class="carte-seance" data-anime>
        <div class="carte-tirage" data-retourner>
          <div class="carte-face">${photo(c, { nom: s.photo, alt: alt(c, s.photo), cadrage: s.cadrage, classe: 'carte-seance-media', ratio: '4 / 5', sizes: '(max-width: 760px) 80vw, 22vw' })}</div>
          <div class="carte-dos" aria-hidden="true"><p class="carte-dos-sur">${c.t('accueil.seances.dos')}</p><p class="carte-dos-nom">${s.nom}</p><p class="carte-dos-pour">${s.pour}</p><p class="carte-dos-prix chiffres">${euros(s.prix)} · ${s.duree}</p><p class="carte-dos-note">${c.t('accueil.seances.dosNote')}</p></div>
        </div>
        <h3>${s.nom}</h3>
        <p class="carte-seance-pour">${s.pour}</p>
        <p class="carte-seance-ligne"><span>${s.duree}</span>${prix(s.prix)}</p>
        ${c.lien('seances', { ancre: 'reservation', params: `seance=${s.id}`, classe: 'lien-fleche', texte: html`${c.t('commun.fiche')} ${icones.fleche}` })}
      </li>`)}
      <li class="carte-seance carte-seance--large" data-anime>
        ${photo(c, { nom: 'photos/chaise-lumiere-fenetre', alt: alt(c, 'chaise-lumiere-fenetre'), cadrage: '50% 30%', classe: 'carte-seance-media', ratio: '4 / 5', sizes: '(max-width: 760px) 80vw, 22vw' })}
        <h3>${c.t('accueil.seances.renaissance')}</h3>
        <p class="carte-seance-pour">${c.t('accueil.seances.renaissancePour')}</p>
        <p class="carte-seance-ligne"><span>${c.t('accueil.seances.renaissanceDuree')}</span><span>${c.t('commun.des')} ${prix(260)}</span></p>
        ${c.lien('seances', { ancre: 'renaissance', classe: 'lien-fleche', texte: html`${c.t('accueil.seances.renaissanceLien')} ${icones.fleche}` })}
      </li>
    </ul>
    <p class="centre" data-anime>${c.lien('seances', { classe: 'bouton bouton--contour', texte: c.t('accueil.seances.tout') })}</p>
  </div>
</section>

<section class="section evenements-accueil" id="evenements">
  <div class="conteneur deux-colonnes">
    ${photo(c, { nom: 'photos/papa-bebe-exterieur', alt: alt(c, 'papa-bebe-exterieur'), cadrage: '50% 40%', classe: 'evenements-media', ratio: '2 / 3', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-parallaxe-interne' })}
    <div>
      ${sur(c.t('accueil.evenements.sur'))}
      <h2 class="titre-section" data-anime>${c.t('accueil.evenements.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('accueil.evenements.texte')}</p>
      <ul class="liste-prix" data-anime>
        ${c.donnees.forfaits.map((f) => html`<li><span>${f.nom}</span><span class="liste-prix-points" aria-hidden="true"></span>${prix(f.prix)}</li>`)}
      </ul>
      <p data-anime>${c.lien('evenements', { classe: 'bouton', texte: c.t('accueil.evenements.lien') })}</p>
    </div>
  </div>
</section>

<section class="section saisons-accueil" id="saisons">
  <div class="conteneur tete-section">
    ${sur(c.t('accueil.saisons.sur'))}
    <h2 class="titre-section" data-anime>${c.t('accueil.saisons.titre')}</h2>
    <p data-anime>${c.t('accueil.saisons.texte')}</p>
  </div>
  <div class="fil" data-fil>
    <svg class="fil-corde" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M-10 8 Q500 70 1010 8" /></svg>
    <div class="fil-defile" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.saisons.titre')}">
    <ul class="fil-tirages" data-statuts data-ouvert="${c.s('seances.saisons.ouvert')}" data-avenir="${c.s('seances.saisons.avenir')}" data-clos="${c.s('seances.saisons.clos')}" data-inconnu="${c.s('seances.saisons.inconnu')}">
      ${c.donnees.saisons.map((s, i) => html`<li class="tirage" style="--i:${i}" data-tirage data-saison="${s.id}"${s.debut ? html` data-debut="${s.debut}" data-fin="${s.fin}"` : ''}>
        <span class="tirage-pince" aria-hidden="true"></span>
        ${photo(c, { nom: s.photo, alt: alt(c, s.photo), cadrage: s.cadrage, classe: 'tirage-media', ratio: '4 / 5', sizes: '(max-width: 760px) 62vw, 18vw', mise: false })}
        <p class="tirage-nom">${s.nom}</p>
        <p class="tirage-detail">${s.prix ? html`${prix(s.prix)} · ` : ''}${s.detail}</p>
        <p class="tirage-statut" data-statut aria-live="polite"></p>
      </li>`)}
    </ul>
    </div>
    <p class="indice-glisser" aria-hidden="true">${c.t('commun.glisser')} ${icones.fleche}</p>
  </div>
  <p class="conteneur centre" data-anime>${c.lien('seances', { ancre: 'saisons', classe: 'lien-fleche', texte: html`${c.t('accueil.saisons.lien')} ${icones.fleche}` })}</p>
</section>

<section class="section photographe-accueil" id="photographe">
  <div class="conteneur deux-colonnes deux-colonnes--inverse">
    <div>
      ${sur(c.t('accueil.photographe.sur'))}
      <h2 class="titre-section" data-anime>${c.t('accueil.photographe.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('accueil.photographe.texte')}</p>
      ${citation(c, 'accueil.photographe.citation')}
      <p data-anime>${c.lien('a-propos', { classe: 'bouton bouton--contour', texte: c.t('accueil.photographe.lien') })}</p>
    </div>
    ${photo(c, { nom: 'photos/portrait-photographe-studio', alt: alt(c, 'portrait-photographe-studio'), cadrage: '50% 30%', classe: 'photographe-media', ratio: '2 / 3', sizes: '(max-width: 760px) 92vw, 36vw', attrs: 'data-parallaxe-interne' })}
  </div>
</section>

${bandeau(c.s('accueil.bandeau2').split(' · '), 1)}

<section class="section lumiere" id="lumiere">
  <div class="conteneur lumiere-grille">
    <div class="lumiere-texte">
      ${sur(c.t('accueil.heure.sur'))}
      <h2 class="titre-section" data-anime>${c.t('accueil.heure.titre')}</h2>
      <p data-anime>${c.t('accueil.heure.texte')}</p>
      <p data-anime>${c.lien('a-propos', { ancre: 'zone', classe: 'lien-fleche', texte: html`${c.t('accueil.heure.lien')} ${icones.fleche}` })}</p>
    </div>
    ${photo(c, { nom: 'photos/lisbonne-pont-portrait', alt: alt(c, 'lisbonne-pont-portrait'), cadrage: '50% 40%', classe: 'lumiere-media', sizes: '(max-width: 760px) 92vw, 60vw' })}
    <div class="soleil" data-soleil data-lat="${c.site.lieu.latitude}" data-lon="${c.site.lieu.longitude}" data-fuseau="${c.site.lieu.fuseau}">
      <p class="soleil-titre">${c.t('heure.titre')} <span class="soleil-date" data-soleil-date></span></p>
      <svg class="soleil-arc" viewBox="0 0 320 130" role="img" aria-label="${c.s('heure.alt')}"><path class="soleil-sol" d="M8 118H312"/><path class="soleil-course" d="M20 118C70 10 250 10 300 118" pathLength="1"/><path class="soleil-doree" data-soleil-doree d="M20 118C70 10 250 10 300 118" pathLength="1"/><circle class="soleil-point" data-soleil-point cx="160" cy="37" r="9"/></svg>
      <dl class="soleil-heures">
        <div><dt>${c.t('heure.lever')}</dt><dd class="chiffres" data-soleil-lever>—</dd></div>
        <div><dt>${c.t('heure.doree')}</dt><dd class="chiffres" data-soleil-plage>—</dd></div>
        <div><dt>${c.t('heure.coucher')}</dt><dd class="chiffres" data-soleil-coucher>—</dd></div>
      </dl>
      <p class="soleil-note">${c.t('heure.note')}</p>
      <noscript><p class="soleil-note">${c.t('heure.sansJs')}</p></noscript>
    </div>
  </div>
</section>

<section class="section fin" id="fin">
  <div class="conteneur fin-grille">
    <div>
      <h2 class="titre-fin" data-anime>${c.t('accueil.fin.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('accueil.fin.texte')}</p>
      <p class="actions" data-anime>
        <a class="bouton" href="${c.url('seances', 'reservation')}" data-libelle="${c.libelle('seances')}" data-magnetique>${c.t('accueil.fin.reserver')}</a>
        ${c.lien('evenements', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('accueil.fin.date') })}
        ${c.lien('a-propos', { ancre: 'contact', classe: 'lien-fleche', texte: html`${c.t('accueil.fin.ecrire')} ${icones.fleche}` })}
      </p>
    </div>
    ${photo(c, { nom: 'photos/studio-nb-assise-sol', alt: alt(c, 'studio-nb-assise-sol'), cadrage: '50% 50%', classe: 'fin-media', ratio: '3 / 2', sizes: '(max-width: 760px) 92vw, 48vw' })}
  </div>
</section>
`;
};
