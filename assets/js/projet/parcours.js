/* Parcours de PausePhoto65 : formulaires en étapes (réservation, demande de date), calendrier,
   récapitulatif en direct, guide « Quelle séance pour moi ? » et sa bague, fil de la journée,
   statut des séances de saison calculé à la date du jour, à l'heure de Tarbes. */
import { etat, allerAncre } from '../socle/index.js?v=1';

const FUSEAU = 'Europe/Paris';

/* Date du jour à Tarbes (et non à l'heure du visiteur) : { a, m, j, iso, md }. */
export function aujourdhui() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { a: +p.year, m: +p.month, j: +p.day, iso: `${p.year}-${p.month}-${p.day}`, md: `${p.month}-${p.day}` };
}
const dateLongue = (iso) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'));
const euros = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\s\u202f\u00a0]/g, '\u00a0') + '\u00a0€';

/* ---------- Statuts des saisons ---------- */
export function statuts() {
  const t = aujourdhui();
  const textes = document.querySelector('[data-statuts]') || document.querySelector('[data-fil] [data-statuts-textes]');
  const lib = (cle) => (textes && textes.dataset[cle]) || cle;
  document.querySelectorAll('[data-saison]').forEach((s) => {
    const zone = s.querySelector('[data-statut]');
    let etatSaison = 'inconnu';
    if (s.dataset.debut) etatSaison = t.md >= s.dataset.debut && t.md <= s.dataset.fin ? 'ouvert' : t.md > s.dataset.fin ? 'clos' : 'avenir';
    if (zone) { zone.textContent = lib(etatSaison); zone.dataset.etat = etatSaison; }
    s.querySelectorAll('[data-si-ouvert]').forEach((a) => { a.hidden = etatSaison !== 'ouvert'; });
  });
  /* Option « Shoot printemps » de la réservation : seulement pendant la saison. */
  document.querySelectorAll('[data-statut-option]').forEach((o) => {
    const ouvert = t.md >= o.dataset.debut && t.md <= o.dataset.fin;
    const input = o.closest('label').querySelector('input');
    if (!ouvert) { input.disabled = true; input.checked = false; o.textContent = lib(t.md > o.dataset.fin ? 'clos' : 'avenir'); }
  });
}

/* ---------- Calendrier ---------- */
function calendrier(conteneur, champ, auChoix) {
  const t = aujourdhui();
  let annee = t.a, mois = t.m;
  const jsem = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))).replace('.', ''));
  /* Grille de 7 colonnes si chaque jour garde au moins 44 px, sinon bande de jours qui défile. */
  const etroit = () => conteneur.clientWidth < 7 * 46 + 24;
  let bande = etroit();
  const rendre = () => {
    const premier = new Date(Date.UTC(annee, mois - 1, 1));
    const decal = (premier.getUTCDay() + 6) % 7;
    const nb = new Date(Date.UTC(annee, mois, 0)).getUTCDate();
    const nomMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(premier);
    const avant = annee === t.a && mois === t.m;
    const limite = (annee - t.a) * 12 + (mois - t.m) >= 11;
    const jourSem = (iso) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')).replace('.', '');
    let cases = bande ? '' : jsem.map((j) => `<span class="cal-jsem" aria-hidden="true">${j}</span>`).join('');
    if (!bande) for (let i = 0; i < decal; i++) cases += '<span aria-hidden="true"></span>';
    for (let j = 1; j <= nb; j++) {
      const iso = `${annee}-${String(mois).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      const passe = iso < t.iso, ajd = iso === t.iso;
      if (bande && passe) continue;
      const etiquette = dateLongue(iso) + (ajd ? ` (${conteneur.dataset.aujourdhui})` : '');
      const contenu = bande ? `<span class="cal-js" aria-hidden="true">${jourSem(iso)}</span><span aria-hidden="true">${j}</span>` : String(j);
      cases += `<button type="button" class="cal-jour${ajd ? ' aujourdhui' : ''}" data-iso="${iso}" aria-label="${etiquette}" aria-pressed="${champ.value === iso}"${passe ? ' disabled' : ''}>${contenu}</button>`;
    }
    conteneur.classList.toggle('calendrier--bande', bande);
    conteneur.innerHTML = `<div class="cal-tete"><button type="button" class="cal-nav" data-nav="-1" aria-label="${conteneur.dataset.precedent}"${avant ? ' disabled' : ''}><svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><p class="cal-mois" aria-live="polite">${nomMois}</p><button type="button" class="cal-nav" data-nav="1" aria-label="${conteneur.dataset.suivant}"${limite ? ' disabled' : ''}><svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="cal-grille"${bande ? ' role="group"' : ''}>${cases}</div>`;
  };
  new ResizeObserver(() => { const b = etroit(); if (b !== bande && conteneur.clientWidth) { bande = b; rendre(); } }).observe(conteneur);
  conteneur.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      mois += +nav.dataset.nav;
      if (mois < 1) { mois = 12; annee--; } else if (mois > 12) { mois = 1; annee++; }
      rendre();
      conteneur.querySelector(`[data-nav="${nav.dataset.nav}"]`)?.focus();
      return;
    }
    const jour = e.target.closest('.cal-jour');
    if (!jour || jour.disabled) return;
    champ.value = jour.dataset.iso;
    conteneur.querySelectorAll('.cal-jour').forEach((b) => b.setAttribute('aria-pressed', String(b === jour)));
    auChoix && auChoix();
  });
  rendre();
}

/* ---------- Formulaires en étapes ---------- */
function etapes(form, majRecap) {
  const liste = [...form.querySelectorAll('[data-etape]')];
  const fil = [...form.querySelectorAll('.etapes-fil li')];
  let n = 0;
  const erreur = (etape, msg) => { const p = etape.querySelector('[data-erreur-etape]'); if (p) p.textContent = msg || ''; };
  const valider = (etape) => {
    const champs = [...etape.querySelectorAll('input, select, textarea')].filter((c) => c.name && !c.disabled);
    const groupes = new Set();
    for (const c of champs) {
      if (c.type === 'radio') {
        if (groupes.has(c.name)) continue;
        groupes.add(c.name);
        const tous = champs.filter((x) => x.name === c.name);
        if (c.required && !tous.some((x) => x.checked)) return { champ: tous.find((x) => !x.disabled), msg: etape.querySelector('legend')?.textContent.replace(/^\d+\.\s*/, '') + '\u00a0: ' + form.dataset.choisir };
        continue;
      }
      const v = (c.value || '').trim();
      if (c.type === 'hidden') {
        if (c.required && !v) { const p = etape.querySelector('[data-erreur-etape]'); return { champ: etape.querySelector('.cal-jour:not(:disabled)'), msg: p && p.dataset.messageJour }; }
        continue;
      }
      if (c.required && !v) return { champ: c, msg: (c.labels && c.labels[0] ? c.labels[0].textContent : '') + '\u00a0: ' + form.dataset.remplir };
      if (c.dataset.dateFuture !== undefined && v && v < aujourdhui().iso) return { champ: c, msg: c.dataset.messagePassee };
    }
    const creneaux = etape.querySelectorAll('input[name="creneau"]');
    if (creneaux.length && ![...creneaux].some((x) => x.checked)) { const p = etape.querySelector('[data-erreur-etape]'); return { champ: creneaux[0], msg: p && p.dataset.messageCreneau }; }
    return null;
  };
  const aller = (k, { focus = true } = {}) => {
    const avantH = form.offsetHeight;
    liste.forEach((e, i) => { e.hidden = i !== k; });
    fil.forEach((li, i) => { li.classList.toggle('actif', i === k); li.classList.toggle('fait', i < k); });
    n = k;
    if (!etat.calme) {
      const apresH = form.offsetHeight;
      form.animate([{ height: avantH + 'px' }, { height: apresH + 'px' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
      liste[k].animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (focus) { const titre = liste[k].querySelector('legend'); if (titre) { titre.tabIndex = -1; titre.focus({ preventScroll: true }); } }
  };
  form.addEventListener('click', (e) => {
    if (e.target.closest('[data-suivant]')) {
      const pb = valider(liste[n]);
      if (pb) { erreur(liste[n], pb.msg); pb.champ && pb.champ.focus(); return; }
      erreur(liste[n], '');
      aller(Math.min(liste.length - 1, n + 1));
    } else if (e.target.closest('[data-precedent]')) aller(Math.max(0, n - 1));
  });
  /* Entrée dans une étape intermédiaire : étape suivante, jamais l'envoi (capture, avant le socle). */
  form.addEventListener('submit', (e) => {
    if (n < liste.length - 1) {
      e.preventDefault(); e.stopImmediatePropagation();
      form.querySelector(`[data-etape="${n + 1}"] [data-suivant], [data-etape]:not([hidden]) [data-suivant]`)?.click();
    }
  }, { capture: true });
  form.addEventListener('change', majRecap);
  form.addEventListener('input', majRecap);
  return { aller, courante: () => n };
}

function reservation() {
  const bloc = document.querySelector('[data-parcours="reservation"]');
  if (!bloc) return;
  const form = bloc.querySelector('form');
  const r = bloc.querySelector('[data-recap]');
  const champJour = form.querySelector('[data-jour]');
  const vide = r.querySelector('[data-recap-seance]').textContent;
  const aucunJour = r.querySelector('[data-recap-jour]').textContent, aucunCreneau = r.querySelector('[data-recap-creneau]').textContent;
  const maj = () => {
    const s = form.querySelector('input[name="seance"]:checked');
    const c = form.querySelector('input[name="creneau"]:checked');
    r.querySelector('[data-recap-seance]').textContent = s ? s.dataset.nom : vide;
    r.querySelector('[data-recap-jour]').textContent = champJour.value ? dateLongue(champJour.value) : aucunJour;
    r.querySelector('[data-recap-creneau]').textContent = c ? c.dataset.libelleCreneau : aucunCreneau;
    r.querySelector('[data-recap-total]').textContent = s ? euros(+s.dataset.prixValeur) : '—';
  };
  r.querySelector('[data-recap-seance]').closest('div').classList.add('recap-seance-ligne');
  const pas = etapes(form, maj);
  calendrier(form.querySelector('[data-calendrier]'), champJour, maj);
  maj();
  /* Boutons contextuels (« Réserver cette séance ») : choix fait, retour à l'étape 1, défilement sans recharger. */
  document.querySelectorAll('[data-vers-reservation]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.dataset.seance || new URL(a.href, location.href).searchParams.get('seance');
    const radio = id && form.querySelector(`input[name="seance"][value="${CSS.escape(id)}"]`);
    if (!radio || radio.disabled) return;
    e.preventDefault();
    radio.checked = true;
    maj();
    pas.aller(0, { focus: false });
    history.replaceState(history.state, '', `${location.pathname}?seance=${encodeURIComponent(id)}#reservation`);
    allerAncre('#reservation', { pousser: false });
  }));
}

function demande() {
  const bloc = document.querySelector('[data-parcours="demande"]');
  if (!bloc) return;
  const form = bloc.querySelector('form');
  const r = bloc.querySelector('[data-recap]');
  const aChoisir = r.dataset.aChoisir;
  const date = form.querySelector('[data-date-future]');
  if (date) date.min = aujourdhui().iso;
  const maj = () => {
    const ev = form.querySelector('input[name="evenement"]:checked');
    const fo = form.querySelector('input[name="forfait"]:checked');
    const commune = form.querySelector('[name="commune"]').value.trim();
    r.querySelector('[data-recap-evenement]').textContent = ev ? ev.dataset.nom : aChoisir;
    r.querySelector('[data-recap-date]').textContent = date.value ? dateLongue(date.value) : aChoisir;
    r.querySelector('[data-recap-commune]').textContent = commune || aChoisir;
    r.querySelector('[data-recap-forfait]').textContent = fo ? `${fo.dataset.nom} · ${euros(+fo.dataset.prixValeur)}` : aChoisir;
    /* Forfaits proposés selon l'événement : mariage d'un côté, baptême et anniversaire de l'autre. */
    const type = ev ? (ev.value === 'mariage' ? 'mariage' : ev.value === 'autre' ? '' : 'bapteme') : '';
    form.querySelectorAll('[data-type]').forEach((o) => { o.hidden = !!type && o.dataset.type !== type; if (o.hidden) o.querySelector('input').checked = false; });
  };
  r.querySelector('[data-recap-evenement]').closest('div').classList.add('recap-seance-ligne');
  const pas = etapes(form, maj);
  maj();
  document.querySelectorAll('[data-vers-demande]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.dataset.forfait;
    const radio = form.querySelector(`input[name="forfait"][value="${CSS.escape(id)}"]`);
    if (!radio) return;
    e.preventDefault();
    const type = radio.closest('[data-type]').dataset.type;
    const ev = form.querySelector(`input[name="evenement"][value="${type === 'mariage' ? 'mariage' : 'bapteme'}"]`);
    if (ev && !form.querySelector('input[name="evenement"]:checked')) ev.checked = true;
    maj();
    radio.checked = true;
    maj();
    pas.aller(0, { focus: false });
    history.replaceState(history.state, '', `${location.pathname}?forfait=${encodeURIComponent(id)}#demande`);
    allerAncre('#demande', { pousser: false });
  }));
  /* Forfait passé dans l'adresse (?forfait=…) : l'événement correspondant est choisi aussi. */
  const p = new URLSearchParams(location.search).get('forfait');
  const radio = p && form.querySelector(`input[name="forfait"][value="${CSS.escape(p)}"]`);
  if (radio) {
    const type = radio.closest('[data-type]').dataset.type;
    const ev = form.querySelector(`input[name="evenement"][value="${type === 'mariage' ? 'mariage' : 'bapteme'}"]`);
    if (ev) ev.checked = true;
    maj(); radio.checked = true; maj();
  }
}

/* ---------- Guide et bague ---------- */
function guide(gsap) {
  const g = document.querySelector('[data-guide]');
  if (!g) return;
  const choix = [...g.querySelectorAll('input[name="guide-qui"]')];
  const graduations = g.querySelector('[data-bague-graduations]');
  const lieu = g.querySelector('[data-guide-lieu]');
  const lien = g.querySelector('[data-guide-lien]');
  const svg = g.querySelector('.bague-svg');
  let angle = 0;
  const tourner = (a, instant) => {
    angle = a;
    if (!gsap || etat.calme || instant) graduations.setAttribute('transform', `rotate(${a})`);
    else gsap.to(graduations, { rotation: a, svgOrigin: '0 0', duration: 0.7, ease: 'power3.out' });
  };
  const maj = (instant) => {
    const i = Math.max(0, choix.findIndex((c) => c.checked));
    const id = choix[i].value;
    g.querySelectorAll('[data-guide-pour]').forEach((d) => { d.hidden = d.dataset.guidePour !== id; });
    const ou = g.querySelector('input[name="guide-ou"]:checked');
    lieu.textContent = lieu.dataset[ou ? ou.value : 'studio'];
    lien.href = `?seance=${id}#reservation`;
    lien.dataset.seance = id;
    tourner(-72 * i, instant);
  };
  g.addEventListener('change', () => maj(false));
  maj(true);
  /* Tourner la bague à la main : elle s'arrête sur le choix le plus proche. */
  let depart = null, base = 0, mesure = null;
  const angleDe = (e) => Math.atan2(e.clientY - mesure.cy, e.clientX - mesure.cx) * 180 / Math.PI;
  svg.addEventListener('pointerdown', (e) => {
    const r = svg.getBoundingClientRect();
    mesure = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    depart = angleDe(e); base = angle;
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e) => {
    if (depart === null) return;
    let d = angleDe(e) - depart;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    graduations.setAttribute('transform', `rotate(${base + d})`);
    angle = base + d;
  });
  const lacherBague = () => {
    if (depart === null) return;
    depart = null;
    const n = choix.length;
    const k = ((Math.round(-angle / 72) % n) + n) % n;
    choix[k].checked = true;
    choix[k].dispatchEvent(new Event('change', { bubbles: true }));
  };
  svg.addEventListener('pointerup', lacherBague);
  svg.addEventListener('pointercancel', lacherBague);
}

/* ---------- Fil de la journée ---------- */
function journee() {
  const j = document.querySelector('[data-journee]');
  if (!j) return;
  const debut = +j.dataset.debut, fin = +j.dataset.fin;
  const plage = j.querySelector('[data-frise-plage]');
  const curseur = j.querySelector('[data-frise-debut]');
  const texte = j.querySelector('[data-plage-texte]');
  const liste = j.querySelector('[data-moments]');
  const piste = j.querySelector('.frise-piste');
  let duree = 8;
  const h = (x) => { const e = Math.floor(x), m = Math.round((x - e) * 60); return `${e % 24 === 0 && e ? 24 : e} h${m ? ' ' + String(m).padStart(2, '0') : ''}`; };
  const maj = () => {
    curseur.max = String(fin - duree);
    const d = Math.min(+curseur.value, fin - duree);
    curseur.value = String(d);
    const f = d + duree;
    plage.style.left = ((d - debut) / (fin - debut)) * 100 + '%';
    plage.style.width = (duree / (fin - debut)) * 100 + '%';
    /* Le curseur du champ a la largeur de la plage : on la saisit et on la déplace directement. */
    curseur.style.setProperty('--pouce', Math.round((piste.clientWidth * duree) / (fin - debut)) + 'px');
    texte.textContent = `${h(d)} – ${h(f)}`;
    curseur.setAttribute('aria-valuetext', `${h(d)} – ${h(f)}`);
    let n = 0;
    j.querySelectorAll('.frise-moment').forEach((m) => m.classList.toggle('couvert', +m.dataset.heure >= d && +m.dataset.heure <= f));
    liste.querySelectorAll('li[data-heure]').forEach((li) => { const ok = +li.dataset.heure >= d && +li.dataset.heure <= f; li.classList.toggle('hors', !ok); if (ok) n++; });
    let aucun = liste.querySelector('.aucun');
    if (!n) { if (!aucun) { aucun = document.createElement('li'); aucun.className = 'aucun'; aucun.textContent = liste.dataset.aucun; liste.appendChild(aucun); } }
    else if (aucun) aucun.remove();
  };
  j.querySelectorAll('[data-duree]').forEach((b) => b.addEventListener('click', () => {
    duree = +b.dataset.duree;
    j.querySelectorAll('[data-duree]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    maj();
  }));
  curseur.addEventListener('input', maj);
  new ResizeObserver(() => maj()).observe(piste);
  maj();
}

export function initParcours(gsap) {
  statuts();
  reservation();
  demande();
  guide(gsap);
  journee();
}
