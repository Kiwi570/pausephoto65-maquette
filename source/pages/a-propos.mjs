/* À propos & contact : la photographe, l'album de famille (vraies photos posées dans les coins de l'album),
   sa façon de faire, collaboratrices, zone de déplacement (carte), formulaire de contact simulé. */
import { html } from '../../outils/gabarit.mjs';
import { photo, sur, externe, icones, citation, bandeau } from '../gabarits/projet.mjs';

export const page = { cle: 'a-propos', fichier: 'a-propos', imagePartage: 'photos/portrait-photographe-studio-1280.webp', intro: 'photos/portrait-photographe-studio' };

const alt = (c, n) => c.donnees.alts[n.replace(/^photos\//, '')] || '';

/* Coins des pochettes de l'album, en % de l'image (mesurés sur l'illustration grok/album-ancien, 1168 × 784) :
   haut-gauche, haut-droite, bas-droite, bas-gauche. */
const COINS = {
  gauche: '21.6,44.6 34.6,40.1 39.0,59.9 25.2,64.6',
  droite: '55.8,35.3 68.0,30.9 73.9,49.9 61.2,54.4',
};

/* Carte : projection simple autour de Tarbes (équirectangulaire), viewBox 600 × 400.
   Repères numérotés (44 px) placés en % du dessin ; noms et distances dans la liste à côté. */
function carte(c) {
  const V = c.donnees.communes;
  const lat0 = 43.19, lon0 = 0.0, k = 820;
  const xy = (v) => [300 + (v.lon - lon0) * k * Math.cos((lat0 * Math.PI) / 180), 200 - (v.lat - lat0) * k];
  const t = xy(V[0]);
  return html`<svg class="carte-svg" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
    <path class="carte-crete" d="M0 372 L40 350 L70 362 L110 328 L150 348 L190 318 L230 340 L262 300 L300 330 L338 306 L372 336 L410 312 L450 342 L492 316 L530 346 L570 326 L600 340 L600 400 L0 400Z"/>
    ${V.slice(1).map((v) => { const [x, y] = xy(v); return html`<path class="carte-trajet" data-trajet="${v.id}" d="M${t[0].toFixed(1)} ${t[1].toFixed(1)}L${x.toFixed(1)} ${y.toFixed(1)}" pathLength="1"/>`; })}
    ${V.map((v) => { const [x, y] = xy(v); return html`<g class="carte-point" data-point="${v.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path class="carte-visee" d="M-24 -13V-24H-13M13 -24H24V-13M24 13V24H13M-13 24H-24V13"/></g>`; })}
  </svg>
  <p class="carte-crete-nom" aria-hidden="true">${c.t('apropos.zone.pyrenees')}</p>
  ${V.map((v, i) => { const [x, y] = xy(v); return html`<button type="button" class="carte-repere${i === 0 ? ' carte-repere--studio' : ''}" data-ville="${v.id}" data-repere style="left:${((x / 600) * 100).toFixed(2)}%;top:${((y / 400) * 100).toFixed(2)}%" aria-pressed="false" aria-label="${v.nom}${i ? ` : ${v.km} ${c.s('apropos.zone.km')}` : ` : ${c.s('apropos.zone.studio')}`}"><span aria-hidden="true">${i + 1}</span></button>`; })}`;
}

export default (c) => {
  const k = c.site.contact;
  return html`
<section class="page-tete ecran" id="ouverture">
  <div class="page-tete-texte">
    <h1 class="titre-page" data-anime="gsap" data-entree>${c.t('apropos.titre')}</h1>
    <blockquote class="citation citation--grande" data-anime="gsap" data-entree><p>${'« ' + c.s('apropos.citation') + ' »'}</p></blockquote>
    <p class="suite-mobile" data-anime="gsap" data-entree>${c.t('apropos.texte')} <span class="a-completer">${c.t('apropos.nom')}</span></p>
    <p class="actions" data-anime="gsap" data-entree><a class="bouton" href="#contact" data-action-principale data-magnetique>${c.t('apropos.action')}</a> <span class="info-cle" data-info-cle>${c.t('apropos.info')}</span></p>
  </div>
  ${photo(c, { nom: 'photos/portrait-photographe-studio', alt: alt(c, 'portrait-photographe-studio'), cadrage: '50% 30%', cadrageMobile: '50% 25%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 92vw, 40vw', attrs: 'data-hero' })}
</section>

${bandeau(c.s('apropos.bandeau').split(' · '), -1)}

<section class="section album-section" id="album">
  <div class="conteneur album-grille">
    <div class="album-texte">
      ${sur(c.t('apropos.album.sur'))}
      <h2 class="titre-section" data-anime>${c.t('apropos.album.titre')}</h2>
      <p class="texte-large" data-anime>${c.t('apropos.album.texte')}</p>
      <p class="note" data-anime>${c.t('apropos.album.note')}</p>
    </div>
    <div class="album" data-album>
      ${photo(c, { nom: 'grok/album-ancien', alt: '', cadrage: '50% 50%', classe: 'album-fond', ratio: '1168 / 784', sizes: '(max-width: 760px) 92vw, 56vw', mise: false })}
      <div class="album-photo" data-coins="${COINS.gauche}" data-anime="gsap">${photo(c, { nom: 'photos/photographe-automne', alt: alt(c, 'photographe-automne'), cadrage: '45% 40%', classe: 'album-image', sizes: '(max-width: 760px) 30vw, 14vw', mise: false })}</div>
      <div class="album-photo" data-coins="${COINS.droite}" data-anime="gsap">${photo(c, { nom: 'photos/photographe-dos-automne', alt: alt(c, 'photographe-dos-automne'), cadrage: '50% 35%', classe: 'album-image', sizes: '(max-width: 760px) 30vw, 14vw', mise: false })}</div>
    </div>
  </div>
</section>

<section class="section facon" id="facon">
  <div class="conteneur deux-colonnes">
    ${photo(c, { nom: 'photos/coquelicots-chapeau-dos', alt: alt(c, 'coquelicots-chapeau-dos'), cadrage: '50% 40%', classe: 'facon-media', ratio: '2 / 3', sizes: '(max-width: 760px) 92vw, 36vw', attrs: 'data-parallaxe-interne' })}
    <div>
      ${sur(c.t('apropos.facon.sur'))}
      <h2 class="titre-section" data-anime>${c.t('apropos.facon.titre')}</h2>
      ${citation(c, 'apropos.facon.citation')}
      <ul class="points">${[1, 2, 3, 4].map((i) => html`<li data-anime><span class="points-num chiffres" aria-hidden="true">0${i}</span>${c.t(`apropos.facon.point${i}`)}</li>`)}</ul>
    </div>
  </div>
</section>

<section class="section collab" id="collaboratrices">
  <div class="conteneur">
    <div class="tete-section">
      ${sur(c.t('apropos.collab.sur'))}
      <h2 class="titre-section" data-anime>${c.t('apropos.collab.titre')}</h2>
    </div>
    <ul class="collab-liste">
      ${[['roseraie', 'logo-la-roseraie'], ['pink', 'logo-pinkbaroque']].map(([x, n]) => html`<li class="collab-carte" data-anime>
        <figure class="collab-logo"><img src="/assets/images/photos/${n}-640.webp" alt="${alt(c, n)}" width="640" height="${Math.round(640 / c.donnees['photos-infos']['photos/' + n].ratio)}" loading="lazy" decoding="async"></figure>
        <div><h3>${c.t(`apropos.collab.${x}`)}</h3><p>${c.t(`apropos.collab.${x}Texte`)}</p></div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="section zone" id="zone">
  <div class="conteneur zone-grille">
    <div>
      ${sur(c.t('apropos.zone.sur'))}
      <h2 class="titre-section" data-anime>${c.t('apropos.zone.titre')}</h2>
      <p data-anime>${c.t('apropos.zone.texte')}</p>
      <ul class="zone-liste" data-anime>
        ${c.donnees.communes.map((v, i) => html`<li data-ville-liste="${v.id}"><span><span class="zone-num" aria-hidden="true">${i + 1}</span>${v.nom}</span><span class="chiffres">${i ? html`${v.km} ${c.t('apropos.zone.km')}` : c.t('apropos.zone.studio')}</span></li>`)}
      </ul>
      <p class="note indice-survol">${c.t('apropos.zone.indice')}</p>
      <p class="note indice-toucher">${c.t('apropos.zone.indiceTactile')}</p>
    </div>
    <div class="carte" data-carte data-visuel>${carte(c)}</div>
  </div>
</section>

<section class="section contact" id="contact">
  <div class="conteneur contact-grille">
    <div class="contact-infos">
      ${sur(c.t('apropos.contact.sur'))}
      <h2 class="titre-section">${c.t('apropos.contact.titre')}</h2>
      <p>${c.t('apropos.contact.texte')}</p>
      <dl class="coordonnees">
        <div><dt>${c.t('apropos.contact.email')}</dt><dd><a href="mailto:${k.email}">${k.email}</a></dd></div>
        <div><dt>${c.t('apropos.contact.adresse')}</dt><dd>${k.adresse}<br>${k.codePostal} ${k.ville}</dd></div>
        <div><dt>${c.t('apropos.contact.reseaux')}</dt><dd><ul class="liens-simples"><li>${externe(c, k.instagram, c.s('commun.instagram'))}</li><li>${externe(c, k.facebook, c.s('commun.facebook'))}</li></ul></dd></div>
      </dl>
      ${photo(c, { nom: 'photos/studio-carte-soleil', alt: alt(c, 'studio-carte-soleil'), cadrage: '50% 45%', classe: 'contact-media', ratio: '4 / 3', sizes: '(max-width: 760px) 92vw, 36vw' })}
    </div>
    <form class="formulaire" data-formulaire action="#" novalidate>
      <div class="champs-2">
        <div class="champ"><label for="c-nom">${c.t('apropos.contact.fNom')}</label><input id="c-nom" name="nom" autocomplete="family-name" required></div>
        <div class="champ"><label for="c-prenom">${c.t('apropos.contact.fPrenom')}</label><input id="c-prenom" name="prenom" autocomplete="given-name"></div>
      </div>
      <div class="champ"><label for="c-email">${c.t('apropos.contact.fEmail')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="c-tel">${c.t('apropos.contact.fTel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel"></div>
      <div class="champ"><label for="c-sujet">${c.t('apropos.contact.fSujet')}</label>
        <select id="c-sujet" name="sujet">
          <option value="seance">${c.t('apropos.contact.sSeance')}</option>
          <option value="renaissance">${c.t('apropos.contact.sRenaissance')}</option>
          <option value="evenement">${c.t('apropos.contact.sEvenement')}</option>
          <option value="autre">${c.t('apropos.contact.sAutre')}</option>
        </select></div>
      <div class="champ"><label for="c-message">${c.t('apropos.contact.fMessage')}</label><textarea id="c-message" name="message" rows="6" required></textarea></div>
      <p class="mention-donnees">${c.tb('apropos.contact.donnees')}</p>
      <button type="submit" class="bouton">${c.t('apropos.contact.envoyer')} ${icones.fleche}</button>
      <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('apropos.contact.envoye')}"></p>
    </form>
  </div>
</section>
`;
};
