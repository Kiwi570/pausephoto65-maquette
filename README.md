# PausePhoto65 — maquette

Maquette du futur site de PausePhoto65, photographe à Tarbes (Hautes-Pyrénées).
Direction « Temps de pose » : lin, encre, terracotta, diaphragme et mise au point.

Adresse prévue : https://pausephoto65-maquette.vercel.app

## Pages

Accueil · Galerie (3 univers, visionneuse) · Séances & tarifs (guide, Renaissance, saisons, réservation simulée) ·
Événements (fil de la journée, forfaits, demande de date simulée) · À propos & contact (album, carte, formulaire) ·
Mentions légales · 404.

## Travailler sur la maquette

1. Textes : `donnees/textes/fr.json` ; séances, forfaits, saisons, galerie, communes, FAQ : `donnees/*.json`.
2. Pages : `source/pages/*.mjs` ; gabarit commun : `source/gabarits/commun.mjs`.
3. Style : `assets/css/site.css` ; effets : `assets/js/site.js` et `assets/js/projet/`.
4. Nouvelles images : `python3 outils/images.py recu/lot.json` puis `python3 outils/flous.py recu/lot.json`
   (versions floues de la mise au point, couleurs dominantes de la galerie).
5. Générer : `node outils/generer.mjs`, puis `node outils/images-partage.mjs`.
6. Auditer : `node _audit/audit.mjs` (jamais `--rapide` avant une livraison).

Ne jamais modifier à la main les pages générées (`index.html`, `galerie.html`…).
Le fonctionnement du socle commun est décrit dans `outils/SOCLE-README.md`.

## À fournir par PausePhoto65

- Prénom ou nom de la photographe, statut, SIRET, directeur ou directrice de la publication.
- Confirmer que les photos de la page À propos du site actuel (en studio, en forêt d'automne) la représentent bien : la maquette les présente comme « la photographe ».
- Contenu de chaque séance (nombre de photos, délai de livraison), détail des forfaits à la demi-journée,
  délai de livraison du forfait mariage complet.
- Modalités de paiement, d'acompte et d'annulation.
- Dates et tarifs des séances de saison (Pâques, été, automne, hiver) ; dates 2027 du Shoot printemps.
- Prix à confirmer : le site actuel affiche aussi « 65 €, 1 h, 8 photos HD » sur la page Au fil des saisons,
  alors que la réservation affiche 75 € (printemps) et 80 € (séance solo). La maquette reprend les prix de la réservation.
- Disponibilités réelles (les créneaux de la réservation sont des exemples).
- Rôle de « Le Cocon de Manon », dont le logo figure sur la page Photographie thérapeutique du site actuel.
- La créatrice des photos « Portrait pro ou petits créateurs » est-elle La Roseraie Création ? (non écrit sur le site tant que ce n'est pas confirmé).
- Le logo en fichier source (vectoriel ou PNG transparent) : seul un JPG sur fond gris existe.
- Avis clients réels, s'il y en a.
- Photos des « petits plus » des événements (photo de groupe, coin photo, arche) : la maquette les liste sans les illustrer.
- Contenu exact du forfait mariage à la journée : la maquette écrit « Couverture de la journée (8 h) », la journée type de 10 h à 18 h est un exemple.
- Politique de confidentialité.

## À la mise en ligne définitive

À retirer :
- la consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json` ;
- les formulaires simulés (réservation, demande de date, contact) : à brancher sur un vrai service d'envoi ;
- les créneaux d'exemple de la réservation et la journée type du fil de la journée (marqués « exemple ») ;
- toutes les mentions « à compléter », une fois les informations fournies ;
- l'adresse de la maquette (`donnees/site.json`, `donnees/structure.json`) : remplacer par le vrai domaine.

À garder :
- la mention « Illustration générée » sur chaque image créée par intelligence artificielle (dossier `assets/images/grok/`) ;
- les photos d'origine sans retouche de couleur ni recadrage dans la visionneuse.

## Images

- Photos : site actuel de PausePhoto65 (`recu/site/`, converties dans `assets/images/photos/`).
- Illustrations générées (Grok) : `assets/images/grok/` — cinq ambiances (album vide, loge de maquillage, table du soir, carnet, bokeh), une au plus par page, jamais de portrait, jamais à la place d'un lieu réel.
- Écartées : 3 doublons, une capture d'écran, une icône, le logo « Le Cocon de Manon » (rôle inconnu).
