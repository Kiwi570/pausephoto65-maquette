# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v3 — correction de l'accueil

- Premier écran de l'accueil : le texte, les deux boutons et l'information « Séances d'une heure dès 80 € » sont centrés sous le titre (ils étaient décalés vers la gauche sur ordinateur).

## v2 — un site plus vivant

**Accueil : premier écran refait**
- Pluie de tirages : un grand titre centré « Faites une pause. », entouré de dix tirages photo (six sur téléphone) qui tombent à l'arrivée et s'éparpillent vers les bords au défilement.
- Les tirages s'attrapent et se lancent à la souris ou au doigt : ils glissent, rebondissent sur les bords et s'arrêtent. Une petite note « Attrapez une photo, lancez-la » apparaît sur ordinateur.
- Plus de grand vide au milieu sur les grands écrans.

**Effets ajoutés sur tout le site**
- Photos qui se révèlent : un rideau qui monte, un léger zoom et le flou qui se règle, à l'arrivée de chaque photo dans l'écran.
- Curseur appareil photo : un viseur dont les crochets se ferment sur les photos, un déclic à chaque clic et un compteur de poses qui descend de 36 à 1.
- Bandeaux de grands mots sur chaque page (séances, événements, univers, communes) : ils défilent en continu, plus vite quand on fait défiler la page, et changent de sens avec elle.
- Titres de section qui s'écrivent lettre à lettre à leur arrivée.

**À manipuler**
- Accueil : la planche contact arrive en pile au centre et s'étale à sa place au défilement, puis les cercles au crayon se tracent.
- Accueil : les photos des séances se retournent au survol (au toucher sur téléphone) ; au dos, le nom, le prix et la durée.
- Galerie : les cinq photos d'ouverture se déplacent et se lancent à la souris (sur ordinateur).

**Inchangé**
- Textes, prix, pages, formulaires simulés et mode calme (qui coupe tous ces effets).

## v1 — la base

**Direction artistique « Temps de pose »**
- Lin lumineux, encre brun-noir, terracotta et sauge ; titres en Fraunces (italique pour les mots clés), texte en Manrope, polices hébergées avec le site.
- Logo de PausePhoto65 dans l'en-tête, le pied de page, l'icône du navigateur et de l'iPhone, et les images de partage.

**Pages**
- Accueil : premier écran « Faites une pause. », Pause / Pose, planche contact des trois univers, séances avec prix, événements, séances de saison, la photographe, la lumière du jour à Tarbes, appel final.
- Galerie : 40 photos en trois salles (Portraits individuel & famille, Regard personnel, Portrait professionnel), filtres gardés dans l'adresse, visionneuse plein écran avec un lien par photo.
- Séances & tarifs : guide « Quelle séance pour moi ? » et sa bague, quatre séances d'une heure, séance Renaissance (ex-photographie thérapeutique, reformulée sans promesse de soin) et ses deux formules, séances de saison, studio, réservation simulée en trois étapes avec calendrier et récapitulatif, questions pratiques.
- Événements : présence discrète, fil de la journée (exemple de plage de 4 h ou 8 h), quatre forfaits, petits plus, demande de date simulée en quatre étapes.
- À propos & contact : la photographe, l'album de famille, sa façon de faire, collaboratrices, carte de la zone de déplacement, formulaire de contact simulé.
- Mentions légales avec la fiche des informations à fournir, hébergeur Vercel (adresse vérifiée sur le site de Vercel), crédits et confidentialité à compléter ; page 404 « Cette page est hors champ. »

**Effets**
- Intro en diaphragme : il se ferme, se rouvre sur la photo de la page, puis s'ouvre jusqu'à découvrir la page.
- Voile entre les pages, avec un diaphragme qui se ferme et se rouvre.
- Mise au point des photos à leur arrivée : WebGL pour la photo d'ouverture sur ordinateur, fondu depuis une version floue ailleurs.
- Pause → Pose au défilement, cercles au crayon sur la planche contact, tirages suspendus qui se balancent, parallaxe, boutons magnétiques, cartes qui s'inclinent, curseur viseur.
- Bague de mise au point du guide, heure dorée calculée en direct pour Tarbes, photos posées dans les coins de l'album, communes mises en avant sur la carte.
- Statut des séances de saison calculé à la date du jour, à l'heure de Tarbes.
- Mode calme : lien « Réduire les animations » dans le menu et le pied de page.

**Images**
- 59 photos et 2 logos de collaboratrices repris du site actuel, convertis en plusieurs tailles, jamais recolorés.
- 5 illustrations générées, une au plus par page (album vide, loge de maquillage, table du soir, carnet, bokeh), chacune marquée « Illustration générée » ; jamais de portrait ni de lieu réel inventé. Les 6 autres images Grok reçues ne sont pas utilisées : studio vide, bague d'objectif, tirages sur une table, appareil argentique, halo de lumière, texture de lin.
- Écartées : 3 doublons, une capture d'écran, une icône, le logo « Le Cocon de Manon ».

**Mise en ligne**
- Site statique prêt pour Vercel, pages exclues de Google (noindex) le temps de la maquette, images de partage par page, données schema.org réelles, audit automatique fourni dans `_audit/`.
