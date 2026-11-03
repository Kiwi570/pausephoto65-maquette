/* Parcours propres à PausePhoto65 : réservation en trois étapes (prérempli, calendrier, double clic),
   demande de date en quatre étapes, guide « Quelle séance pour moi ? », filtres et visionneuse de la galerie,
   fil de la journée, statut des séances de saison calculé à la date du jour (heure de Tarbes). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const lieu = (page, taille) => ({ page, taille });

  /* 1. Réservation : bouton contextuel prérempli, total juste, étapes, calendrier, envoi simulé sans double envoi. */
  for (const taille of [T('390×844'), T('1366×768'), T('320×568')]) {
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/seances?seance=duo#reservation', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(600);
      const r1 = await page.evaluate(() => ({
        coche: document.querySelector('input[name="seance"]:checked')?.value,
        total: document.querySelector('[data-recap-total]')?.textContent.replace(/\s/g, ''),
        totalVisible: (() => { const e = document.querySelector('[data-recap-total]'); const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })(),
      }));
      if (r1.coche !== 'duo') R.echec('réservation', `séance non préremplie par ?seance=duo (${r1.coche})`, lieu('/seances', taille.nom));
      if (r1.total !== '90€') R.echec('réservation', `total ${r1.total} au lieu de 90 €`, lieu('/seances', taille.nom));
      if (!r1.totalVisible) R.echec('réservation', 'le total n’est pas visible pendant le choix', lieu('/seances', taille.nom));
      /* Étape 2 sans jour : message d'erreur, on reste à l'étape 2. */
      const cliquer = async (sel) => { await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel); await attendre(150); await page.click(sel); };
      await cliquer('[data-etape="1"] [data-suivant]');
      await attendre(500);
      await cliquer('[data-etape="2"] [data-suivant]');
      await attendre(300);
      const e2 = await page.evaluate(() => ({ visible: !document.querySelector('[data-etape="2"]').hidden, msg: document.querySelector('[data-etape="2"] [data-erreur-etape]').textContent.trim() }));
      if (!e2.visible || !e2.msg) R.echec('réservation', 'étape 2 franchie sans jour choisi, ou sans message', lieu('/seances', taille.nom));
      /* Jours passés grisés, jour choisi, créneau, étape 3. */
      const cal = await page.evaluate(() => {
        const jours = [...document.querySelectorAll('.cal-jour')];
        const petits = jours.filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && (r.width < 43.5 || r.height < 43.5); }).length;
        return { n: jours.length, actifs: jours.filter((b) => !b.disabled).length, petits };
      });
      if (!cal.actifs) R.echec('réservation', 'aucun jour sélectionnable dans le calendrier', lieu('/seances', taille.nom));
      if (cal.petits) R.echec('réservation', `${cal.petits} jour(s) du calendrier sous 44 px`, lieu('/seances', taille.nom));
      await page.evaluate(() => document.querySelector('.cal-jour:not([disabled])').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.locator('.cal-jour:not([disabled])').first().click();
      await page.locator('input[name="creneau"]').first().check({ force: true });
      await cliquer('[data-etape="2"] [data-suivant]');
      await attendre(500);
      const e3 = await page.evaluate(() => !document.querySelector('[data-etape="3"]').hidden);
      if (!e3) R.echec('réservation', 'étape 3 inaccessible après le choix du jour et du créneau', lieu('/seances', taille.nom));
      await page.fill('#r-nom', 'Essai'); await page.fill('#r-prenom', 'Audit'); await page.fill('#r-email', 'essai@exemple.fr');
      await page.evaluate(() => document.querySelector('[data-etape="3"] [type="submit"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
      const bouton = page.locator('[data-etape="3"] [type="submit"]');
      await bouton.dblclick();
      await attendre(400);
      const fin = await page.evaluate(() => ({ msg: !document.querySelector('[data-parcours="reservation"] [data-message-envoi]').hidden, desactive: document.querySelector('[data-etape="3"] [type="submit"]').disabled }));
      if (!fin.msg) R.echec('réservation', 'aucun message après l’envoi simulé', lieu('/seances', taille.nom));
      if (!fin.desactive) R.echec('réservation', 'bouton d’envoi encore actif (double envoi possible)', lieu('/seances', taille.nom));
    } catch (err) { R.echec('réservation', String(err.message).split('\n')[0], lieu('/seances', taille.nom)); }
    finally { await ctx.close(); }
  }

  /* 2. Guide : le choix change la séance conseillée, son prix et le lien de réservation. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/seances#guide', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('input[name="guide-qui"][value="famille"]').check({ force: true });
      await attendre(300);
      const g = await page.evaluate(() => ({ nom: [...document.querySelectorAll('[data-guide-pour]')].find((d) => !d.hidden)?.textContent.replace(/\s+/g, ' ').trim(), lien: document.querySelector('[data-guide-lien]').getAttribute('href') }));
      if (!/famille/i.test(g.nom || '') || !/100/.test(g.nom || '')) R.echec('guide', `conseil inattendu pour « En famille » : ${g.nom}`, lieu('/seances', '1366×768'));
      if (!/seance=famille/.test(g.lien)) R.echec('guide', `lien de réservation non mis à jour : ${g.lien}`, lieu('/seances', '1366×768'));
      /* Bouton contextuel : pas de rechargement, séance choisie. */
      await page.evaluate(() => { window.__pasRecharge = true; });
      await page.click('[data-guide-lien]');
      await attendre(900);
      const apres = await page.evaluate(() => ({ ok: window.__pasRecharge === true, coche: document.querySelector('input[name="seance"]:checked')?.value }));
      if (!apres.ok) R.echec('guide', 'le bouton du guide recharge la page', lieu('/seances', '1366×768'));
      if (apres.coche !== 'famille') R.echec('guide', `séance non choisie dans la réservation (${apres.coche})`, lieu('/seances', '1366×768'));
    } catch (err) { R.echec('guide', String(err.message).split('\n')[0], lieu('/seances', '1366×768')); }
    finally { await ctx.close(); }
  }

  /* 3. Statut des saisons : calculé à la date du jour, à l'heure de Tarbes. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      for (const u of ['/', '/seances']) {
        await page.goto(BASE + u, { waitUntil: 'load' });
        await attendrePret(page);
        const r = await page.evaluate(() => {
          const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
          const md = `${p.month}-${p.day}`;
          const s = document.querySelector('[data-saison="printemps"]');
          const attendu = md >= s.dataset.debut && md <= s.dataset.fin ? 'ouvert' : md > s.dataset.fin ? 'clos' : 'avenir';
          const z = s.querySelector('[data-statut]');
          return { attendu, obtenu: z && z.dataset.etat, texte: z && z.textContent.trim() };
        });
        if (r.obtenu !== r.attendu || !r.texte) R.echec('statut des saisons', `printemps : ${r.obtenu} au lieu de ${r.attendu}`, lieu(u, '1366×768'));
      }
    } catch (err) { R.echec('statut des saisons', String(err.message).split('\n')[0], lieu('/', '1366×768')); }
    finally { await ctx.close(); }
  }

  /* 4. Demande de date : forfait prérempli par l'adresse, événement associé, quatre étapes. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/evenements?forfait=mariage-journee#demande', { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => ({ f: document.querySelector('input[name="forfait"]:checked')?.value, e: document.querySelector('input[name="evenement"]:checked')?.value, recap: document.querySelector('[data-recap-forfait]').textContent }));
      if (r.f !== 'mariage-journee' || r.e !== 'mariage') R.echec('demande de date', `préremplissage incomplet (forfait ${r.f}, événement ${r.e})`, lieu('/evenements', '390×844'));
      if (!/1\s?100/.test(r.recap.replace(/\s/g, ' '))) R.echec('demande de date', `récapitulatif sans le prix : ${r.recap}`, lieu('/evenements', '390×844'));
      await page.evaluate(() => document.querySelector('[data-etape="1"] [data-suivant]').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.click('[data-etape="1"] [data-suivant]');
      await attendre(400);
      await page.fill('#d-date', '2001-01-01');
      await page.fill('#d-commune', 'Tarbes');
      await page.evaluate(() => document.querySelector('[data-etape="2"] [data-suivant]').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.click('[data-etape="2"] [data-suivant]');
      await attendre(300);
      const passee = await page.evaluate(() => !document.querySelector('[data-etape="2"]').hidden && !!document.querySelector('[data-etape="2"] [data-erreur-etape]').textContent.trim());
      if (!passee) R.echec('demande de date', 'une date passée est acceptée', lieu('/evenements', '390×844'));
    } catch (err) { R.echec('demande de date', String(err.message).split('\n')[0], lieu('/evenements', '390×844')); }
    finally { await ctx.close(); }
  }

  /* 5. Galerie : filtre gardé dans l'adresse, salles cachées, visionneuse (Échap, focus rendu, lien direct). */
  for (const taille of [T('1366×768'), T('390×844')]) {
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/galerie', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('[data-filtre="regard"]');
      await attendre(700);
      const f = await page.evaluate(() => ({ url: location.search, visibles: [...document.querySelectorAll('[data-salle]')].filter((s) => !s.hidden).map((s) => s.id) }));
      if (f.url !== '?univers=regard' || f.visibles.join() !== 'regard') R.echec('filtres de la galerie', `après « Regard personnel » : ${f.url}, salles ${f.visibles.join(', ')}`, lieu('/galerie', taille.nom));
      await page.click('[data-filtre="tous"]');
      await attendre(400);
      await page.locator('[data-photo]').first().scrollIntoViewIfNeeded();
      await page.locator('[data-photo]').first().click();
      await attendre(700);
      const o = await page.evaluate(() => ({ ouvert: !document.querySelector('[data-visionneuse]').hidden, focus: !!document.activeElement.closest('[data-visionneuse]'), hash: location.hash, image: document.querySelector('[data-visionneuse-image]').complete && document.querySelector('[data-visionneuse-image]').naturalWidth > 0 }));
      if (!o.ouvert || !o.focus) R.echec('visionneuse', 'ne s’ouvre pas ou le focus n’y entre pas', lieu('/galerie', taille.nom));
      if (!/^#photo-/.test(o.hash)) R.echec('visionneuse', 'pas de lien direct vers la photo ouverte', lieu('/galerie', taille.nom));
      if (!o.image) R.echec('visionneuse', 'image non chargée', lieu('/galerie', taille.nom));
      await page.keyboard.press('ArrowRight');
      await attendre(300);
      await page.keyboard.press('Escape');
      await attendre(500);
      const c = await page.evaluate(() => ({ ferme: document.querySelector('[data-visionneuse]').hidden, focus: !!document.activeElement.closest('[data-photo]') }));
      if (!c.ferme) R.echec('visionneuse', 'Échap ne la ferme pas', lieu('/galerie', taille.nom));
      if (!c.focus) R.echec('visionneuse', 'le focus ne revient pas à la photo', lieu('/galerie', taille.nom));
      /* Lien direct. */
      await page.goto(BASE + '/galerie#photo-pro-03', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(800);
      const d = await page.evaluate(() => !document.querySelector('[data-visionneuse]').hidden && /creatrice/.test(document.querySelector('[data-visionneuse-image]').currentSrc));
      if (!d) R.echec('visionneuse', 'le lien #photo-pro-03 n’ouvre pas la bonne photo', lieu('/galerie', taille.nom));
    } catch (err) { R.echec('galerie', String(err.message).split('\n')[0], lieu('/galerie', taille.nom)); }
    finally { await ctx.close(); }
  }

  /* 6. Fil de la journée : demi-journée, plage déplacée, moments couverts cohérents. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/evenements#journee', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('[data-duree="4"]');
      await page.evaluate(() => { const i = document.querySelector('[data-frise-debut]'); i.value = '16'; i.dispatchEvent(new Event('input', { bubbles: true })); });
      await attendre(200);
      const r = await page.evaluate(() => ({ texte: document.querySelector('[data-plage-texte]').textContent, visibles: [...document.querySelectorAll('[data-moments] li[data-heure]')].filter((l) => !l.hidden && !l.classList.contains('hors')).map((l) => +l.dataset.heure) }));
      if (!/16 h\s*–\s*20 h/.test(r.texte)) R.echec('fil de la journée', `plage affichée « ${r.texte} » au lieu de 16 h – 20 h`, lieu('/evenements', '1366×768'));
      if (r.visibles.some((h) => h < 16 || h > 20) || !r.visibles.length) R.echec('fil de la journée', `moments couverts incohérents : ${r.visibles.join(', ')}`, lieu('/evenements', '1366×768'));
    } catch (err) { R.echec('fil de la journée', String(err.message).split('\n')[0], lieu('/evenements', '1366×768')); }
    finally { await ctx.close(); }
  }
}
