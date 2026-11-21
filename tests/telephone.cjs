// Vérifie le site EN LIGNE (ou une adresse donnée) dans Chrome au format téléphone (cahier des charges § 12 et § 14) :
//  - aucune erreur dans la console ;
//  - chaque sorte de carte tient sans défiler à 7 tailles de téléphone (avant et après la réponse) ;
//  - voix anglaise simulée : la voix britannique est choisie avant l'américaine, les phrases dites sont les bonnes ;
//  - jamais de français à l'écran avant la réponse ;
//  - premier lancement : le tour de la fiche, les mots reconnus passent en boîte 1 ;
//  - une séance du jour complète, 12 cartes au plus, paquets sans jumeaux ;
//  - les boîtes sur plusieurs jours simulés (1, 3, 7, 21 jours ; un raté redescend) et la vitesse d'apprentissage ;
//  - un mot ne monte que par une réussite vérifiée par l'appli ;
//  - le bonus « Je m'habille » (a red cap, red shoes, an orange jacket, a dark blue coat) ;
//  - la fiche (soulever, écouter), le coin des parents, « Tout recommencer » sans fenêtre du navigateur ;
//  - l'appli marche hors ligne après une première visite ;
//  - l'appli apparaît sur « Mes applis », dans le thème « Anglais ».
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/say-it/';
const LIVE = !process.argv[2];
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
// Écrans d'ordinateur portable bas et larges (fenêtre de navigateur avec ses barres)
const ORDIS = [[1366, 600], [1280, 560], [1536, 700]];
const expectedCache = (fs.readFileSync(__dirname + '/../sw.js', 'utf8').match(/say-it-v\d+/) || [])[0];
const REGLAGES = JSON.stringify({ son: false, anim: false, lente: false, francais: true, voix: '' });

const lignes = [];
let echec = false;
function note(ok, texte) { if (!ok) echec = true; lignes.push(`| ${ok ? '✅' : '❌'} | ${texte} |`); console.log((ok ? 'OK   ' : 'ÉCHEC ') + texte); }

// Voix anglaise simulée (le navigateur des tests n'en a pas) : une américaine d'abord, puis une britannique.
function voixSimulee() {
  const voices = [
    { name: 'Test US', lang: 'en-US', localService: true, voiceURI: 'us' },
    { name: 'Test UK', lang: 'en-GB', localService: true, voiceURI: 'uk' },
    { name: 'Test FR', lang: 'fr-FR', localService: true, voiceURI: 'fr' }
  ];
  window.__paroles = [];
  const synth = {
    getVoices: () => voices, speaking: false,
    speak: u => { window.__paroles.push({ t: u.text, voix: u.voice && u.voice.name, rate: u.rate }); setTimeout(() => u.onend && u.onend(), 5); },
    cancel() {}, addEventListener() {}
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
}

async function nouvellePage(browser, w, h, erreurs, o = {}) {
  const ordi = w > 900;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: ordi ? 1 : 2, isMobile: !ordi, hasTouch: !ordi });
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  page.on('dialog', d => { erreurs.push('fenêtre du navigateur : ' + d.message()); d.dismiss(); });
  if (!o.sansVoix) await page.addInitScript(voixSimulee);
  await page.addInitScript(([r, st]) => {
    if (!sessionStorage.getItem('pret')) {
      sessionStorage.setItem('pret', '1');
      localStorage.setItem('marc.anglais.reglages', r);
      Object.keys(st).forEach(k => localStorage.setItem(k, JSON.stringify(st[k])));
    }
  }, [REGLAGES, o.stockage || {}]);
  await page.goto(URL + '?nocache=' + Date.now());
  await page.waitForFunction(() => window.__sayit);
  return page;
}
const etat = page => page.evaluate(() => __sayit.etat());
const jeu = (page, f, a) => page.evaluate(f, a);
// Combien l'écran déborde : la page entière, ou un dessin qui sort de sa zone (et passerait sous le message)
async function debord(page) {
  return page.evaluate(() => {
    let d = document.documentElement.scrollHeight - innerHeight;
    const z = document.querySelector('#jZone');
    if (z && z.offsetParent) {
      const zb = z.getBoundingClientRect().bottom;
      z.querySelectorAll('.case, .img-btn, .choix, .etiq, .cadre').forEach(e => { d = Math.max(d, Math.round(e.getBoundingClientRect().bottom - zb - 1)); });
      // Chaque dessin reste dans sa case (sinon il dépasse en bas, vu sur un ordinateur portable)
      z.querySelectorAll('svg.dessin').forEach(sv => {
        const c = sv.closest('.img-btn, .case .img, .cadre');
        if (!c) return;
        const a = sv.getBoundingClientRect(), b = c.getBoundingClientRect();
        d = Math.max(d, Math.round(a.bottom - b.bottom - 1), Math.round(a.right - b.right - 1), Math.round(b.top - a.top - 1), Math.round(b.left - a.left - 1));
      });
    }
    return d;
  });
}
// Tous les mots vus depuis longtemps, en boîte 2 (pour ouvrir les jumeaux, le bonus, les cartes « c »)
function tousVus(boite) {
  const p = {};
  ['yellow', 'brown', 'blue', 'darkblue', 'white', 'black', 'pink', 'purple', 'grey', 'green', 'orange', 'red',
    'cap', 'shoes', 'socks', 'coat', 'skirt', 'dress', 'trousers', 'shorts', 'tshirt', 'shirt', 'jumper', 'jacket', 'hoodie']
    .forEach(id => { p[id] = { boite, prochaine: '2000-01-01', dernierJour: '2000-01-01', reussites: 3, rates: 1, jo: 3 }; });
  return p;
}

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  if (LIVE) {
    for (let i = 0; ; i++) {
      const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
      if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
      if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  const browser = await chromium.launch();

  // 1. Les 7 tailles : chaque sorte de carte tient sans défiler, avant et après la réponse
  for (const [w, h] of SIZES.concat(ORDIS)) {
    const erreurs = [], page = await nouvellePage(browser, w, h, erreurs, { stockage: { 'marc.anglais.progres': tousVus(2), 'marc.anglais.journal': { jours: {}, tour: true, paquets: {}, jumeaux: {} } } });
    const pire = { d: 0, ou: '' };
    const mesure = async (ou) => { const d = await debord(page); if (d > pire.d) { pire.d = d; pire.ou = ou; } };
    const cap = async (nom) => { if (w === 320 || w === 390 && h === 844 || w === 1366) await page.screenshot({ path: `captures/${nom}-${w}x${h}.png` }); };
    await page.screenshot({ path: `captures/accueil-${w}x${h}.png`, fullPage: true });
    // Les mots les plus longs de chaque sorte
    const cartes = [
      { t: 'a', id: 'darkblue' }, { t: 'a', id: 'tshirt' }, { t: 'a', id: 'hoodie' },
      { t: 'b', id: 'trousers' }, { t: 'b', id: 'grey' },
      { t: 'c', id: 'darkblue' }, { t: 'c', id: 'tshirt' },
      { t: 'intro', ids: ['yellow', 'cap', 'darkblue', 'trousers'] },
      { t: 'd', paire: ['tshirt', 'shirt'] }
    ];
    await jeu(page, c => __sayit.lancer('libre', c), cartes);
    for (let k = 0; k < cartes.length; k++) {
      const c = cartes[k], nom = c.t + '-' + (c.id || (c.ids || c.paire).join('+'));
      await mesure(nom + ' question'); if (k === 0 || k === 3 || k === 5 || k === 7 || k === 8) await cap('carte-' + c.t);
      if (c.t === 'a') { await jeu(page, () => __sayit.lever()); await mesure(nom + ' soulevée'); if (k === 0) await cap('carte-a-soulevee'); await page.click('#jPasEncore'); continue; }
      if (c.t === 'b' || c.t === 'c') { await jeu(page, () => __sayit.repondre(false)); await mesure(nom + ' erreur'); if (k === 3 || k === 5) await cap('carte-' + c.t + '-erreur'); await page.click('#jSuivant'); continue; }
      if (c.t === 'intro') { for (const el of await page.$$('#jZone .case')) await el.click(); await mesure(nom + ' soulevés'); await cap('carte-intro-leves'); await page.click('#jCompris'); continue; }
      if (c.t === 'd') { await jeu(page, () => __sayit.juste()); }
    }
    // Bonus : les étiquettes (toutes posées, avec l'étiquette en trop) et « Qui porte quoi ? »
    await jeu(page, () => __sayit.lancer('bonus', [{ t: 'range', habit: 'trousers', couleur: 'darkblue' }, { t: 'range', habit: 'jacket', couleur: 'orange' }, __sayit.carteQui(), __sayit.carteQui()]));
    await mesure('étiquettes'); await cap('bonus-etiquettes');
    for (let k = 0; k < 4; k++) { const b = await page.$('#jPool .etiq'); if (b) await b.click(); }
    await mesure('étiquettes posées');
    await page.click('#jVerifier'); await mesure('étiquettes corrigées'); await cap('bonus-etiquettes-corrigees');
    await page.click('#jSuivant'); await jeu(page, () => __sayit.juste());
    await mesure('qui porte quoi'); await cap('bonus-qui');
    await jeu(page, () => __sayit.repondre(false)); await mesure('qui porte quoi erreur');
    note(pire.d <= 0, `${w}×${h} : chaque carte tient sans défiler (dis-le, écoute, choisis, nouveaux mots, jumeaux, étiquettes, qui porte quoi)${pire.d > 0 ? ' : déborde de ' + pire.d + ' px (' + pire.ou + ')' : ''}`);
    note(!erreurs.length, `${w}×${h} : console sans erreur` + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 2. Premier lancement : le tour de la fiche ; la voix britannique ; pas de français avant la réponse
  {
    const erreurs = [], page = await nouvellePage(browser, 390, 844, erreurs);
    const voix = await jeu(page, () => __sayit.voix());
    note(voix && voix.lang === 'en-GB', 'Voix : la britannique est choisie avant l\'américaine' + (voix ? ' (' + voix.name + ')' : ''));
    await page.click('#bJour');
    const e0 = await etat(page);
    // Avant la réponse : ni le mot ni le français à l'écran
    const avant = await page.evaluate(() => document.querySelector('#vJeu').innerText);
    const mots = await jeu(page, () => __sayit.MOTS.map(m => [m.en, m.fr]));
    const fuite = mots.filter(([en, fr]) => new RegExp('\\b' + en + '\\b', 'i').test(avant) || new RegExp('\\b' + fr + '\\b', 'i').test(avant.replace(/Écoute et touche la bonne image\./, '')));
    const dit = await page.evaluate(() => window.__paroles.map(p => p.t));
    const motCarte = await jeu(page, () => __sayit.MOTS.find(m => m.id === __sayit.etat().carte.id).phrase);
    await page.screenshot({ path: 'captures/tour.png' });
    note(e0.run && e0.run.mode === 'tour' && e0.run.n === 25 && e0.run.cartes.every(c => c.t === 'b'), 'Premier lancement : « Mon anglais du jour » ouvre le tour de la fiche (25 cartes « écoute et touche »)');
    note(!fuite.length, 'Pas de mot ni de français à l\'écran avant la réponse' + (fuite.length ? ' : ' + fuite.map(x => x[0]).join(', ') : ''));
    note(dit.includes(motCarte), `La voix dit la phrase de la carte (« ${motCarte} »)`);
    // Il reconnaît 10 mots sur 25
    for (let k = 0; k < 25; k++) await jeu(page, k => k < 10 ? __sayit.juste() : __sayit.faux(), k);
    const e1 = await etat(page), pr = await jeu(page, () => __sayit.progres());
    const b1 = Object.values(pr).filter(x => x.boite === 1).length;
    await page.screenshot({ path: 'captures/fin-tour.png' });
    note(e1.vue === 'vFin' && e1.tour && b1 === 10 && Object.keys(pr).length === 10, `Après le tour : 10 mots reconnus en boîte 1 (revus demain), les 15 autres restent nouveaux (${b1} en boîte 1)`);
    note(!erreurs.length, 'Console sans erreur (premier lancement)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 3. Une séance du jour complète, un « Pas encore » et une erreur
  {
    const erreurs = [], page = await nouvellePage(browser, 390, 844, erreurs);
    await jeu(page, () => { __sayit.lancerJour(); for (let k = 0; k < 25; k++) __sayit.faux(); }); // tour : rien reconnu
    await jeu(page, () => __sayit.decaler(1));
    await jeu(page, () => __sayit.accueil());
    const plan0 = await jeu(page, () => __sayit.plan());
    const jum = await jeu(page, () => __sayit.JUMEAUX);
    const coul = ['yellow', 'brown', 'blue', 'darkblue', 'white', 'black', 'pink', 'purple', 'grey', 'green', 'orange', 'red'];
    const pqOk = plan0.paquets.length === 2 && plan0.paquets.every(p => p.length === 4 && p.filter(id => coul.includes(id)).length === 2 && !jum.some(([x, y]) => p.includes(x) && p.includes(y)));
    note(pqOk && plan0.n === 10, `Séance sans mot à revoir : 2 paquets de 4 nouveaux mots (2 couleurs + 2 vêtements, sans jumeaux) : ${plan0.paquets.map(p => p.join(' ')).join(' / ')}`);
    await page.click('#bJour');
    let vus = [], n = 0, rate = null;
    for (; n < 30; n++) {
      const e = await etat(page);
      if (e.vue !== 'vJeu') break;
      vus.push(e.carte.t);
      if (e.carte.t === 'b' && !rate) { rate = e.carte.id; await jeu(page, () => __sayit.faux()); }
      else await jeu(page, () => __sayit.juste());
    }
    const pr = await jeu(page, () => __sayit.progres()), e2 = await etat(page);
    await page.screenshot({ path: 'captures/bravo.png' });
    note(e2.vue === 'vFin' && vus.length <= 12 && vus.filter(t => t === 'intro').length === 2,
      `Séance jouée jusqu'au bout : ${vus.length} cartes (12 au plus) : ${vus.join(' ')}`);
    note(pr[rate] && pr[rate].boite === 1 && pr[rate].rates === 1 && Object.values(pr).filter(x => x.boite === 1).length === 8,
      `Les 8 nouveaux mots passent en boîte 1 ; le mot raté (${rate}) aussi, avec un raté noté, revu demain`);
    // Le lendemain : 8 mots à revoir, carte « dis-le » puis carte vérifiée ; « Pas encore » sur l'un, erreur sur un autre
    await jeu(page, () => __sayit.decaler(2));
    const plan1 = await jeu(page, () => __sayit.plan());
    await page.click('#bJour');
    // Contrôle du bouton « Soulever » : inactif 2 secondes
    let e = await etat(page);
    while (e.carte.t !== 'a') { await jeu(page, () => __sayit.juste()); e = await etat(page); }
    const bloque = await page.$eval('#jLever', b => b.disabled);
    const frAvant = await page.evaluate(() => { const f = document.querySelector('#jZone .case .fr'); return f ? getComputedStyle(f).visibility : 'aucun'; });
    await page.waitForTimeout(2200);
    const libre = await page.$eval('#jLever', b => !b.disabled);
    await page.screenshot({ path: 'captures/carte-a.png' });
    note(bloque && libre && frAvant === 'hidden', '« Soulever » attend 2 secondes, le mot et le français restent cachés avant');
    const pasEncore = e.carte.id;
    await page.click('#jLever'); await page.click('#jPasEncore');
    let cartes = 1;
    for (; cartes < 30; cartes++) {
      e = await etat(page);
      if (e.vue !== 'vJeu') break;
      await jeu(page, () => __sayit.juste());
    }
    const pr2 = await jeu(page, () => __sayit.progres()), j = await jeu(page, () => __sayit.journal());
    const d = e.jour;
    note(plan1.due.length === 6 && plan1.paquets.length === 0 && plan1.n === 12, `Le lendemain : ${plan1.due.length} mots à revoir (2 cartes chacun), 12 cartes, pas de nouveau paquet`);
    note(pr2[pasEncore].boite === 1 && pr2[pasEncore].rates === 1 && Object.entries(pr2).filter(([id, x]) => id !== pasEncore && x.boite === 2).length === 5,
      `« Pas encore » : le mot ne monte pas (${pasEncore} reste en boîte 1) même réussi ensuite ; les 5 autres montent en boîte 2`);
    note(!erreurs.length, 'Console sans erreur (séance du jour)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 4. Les boîtes sur plusieurs jours simulés
  {
    const erreurs = [], page = await nouvellePage(browser, 390, 844, erreurs);
    const r = await jeu(page, () => {
      const out = { max: 0, jourTous: 0, jours: [] };
      __sayit.lancerJour(); for (let k = 0; k < 25; k++) __sayit.faux();   // tour : rien reconnu (le pire cas)
      const ecarts = {};
      for (let jour = 0; jour <= 40; jour++) {
        __sayit.decaler(jour);
        const d = __sayit.etat().jour;
        __sayit.lancerJour();
        let n = 0;
        while (__sayit.etat().vue === 'vJeu' && n < 40) { __sayit.juste(); n++; }
        out.max = Math.max(out.max, n);
        out.jours.push(n);
        const p = __sayit.progres();
        Object.values(p).forEach(x => { if (x.dernierJour === d) ecarts[x.boite + ':' + Math.round((new Date(x.prochaine) - new Date(d)) / 864e5)] = 1; });
        if (!out.jourTous && Object.keys(p).length === 25 && Object.values(p).every(x => x.boite >= 3)) out.jourTous = jour;
      }
      out.ecarts = Object.keys(ecarts).sort();
      return out;
    });
    console.log('   cartes par jour : ' + r.jours.join(' '));
    note(r.max <= 12, `40 jours simulés, une séance par jour : jamais plus de 12 cartes (au plus ${r.max})`);
    note(r.jourTous > 0 && r.jourTous <= 30, `Un enfant qui réussit tout et ne connaît aucun mot au départ : les 25 mots sont sus au jour ${r.jourTous}`);
    note(JSON.stringify(r.ecarts) === JSON.stringify(['1:1', '2:3', '3:7', '4:21']), `Écarts après une réussite : ${r.ecarts.map(x => 'boîte ' + x.replace(':', ' → ') + ' j').join(', ')}`);
    // Un raté redescend d'une boîte et revient le lendemain
    const rate = await jeu(page, () => {
      __sayit.decaler(100);
      __sayit.lancerJour();
      let id = null;
      while (__sayit.etat().vue === 'vJeu') {
        const c = __sayit.etat().carte;
        if (!id && (c.t === 'c' || c.t === 'b')) { id = c.id; __sayit.faux(); } else __sayit.juste();
      }
      return { id, p: __sayit.progres()[id], jour: __sayit.etat().jour };
    });
    note(rate.p && rate.p.boite === 3 && rate.p.prochaine > rate.jour, `Un raté en boîte 4 redescend en boîte 3 et revient le lendemain (${rate.id} : boîte ${rate.p && rate.p.boite}, ${rate.p && rate.p.prochaine})`);
    note(!erreurs.length, 'Console sans erreur (jours simulés)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 5. Les jumeaux et le bonus « Je m'habille »
  {
    const erreurs = [], page = await nouvellePage(browser, 390, 844, erreurs, { stockage: { 'marc.anglais.progres': tousVus(2), 'marc.anglais.journal': { jours: {}, tour: true, paquets: {}, jumeaux: {} } } });
    const plan = await jeu(page, () => __sayit.plan());
    note(!!plan.paire && plan.n <= 12, `Jumeaux ouverts quand les deux mots sont réussis 2 jours : une carte « ${plan.paire && plan.paire.join(' / ')} » dans la séance`);
    const g = await jeu(page, () => [['cap', 'red'], ['shoes', 'red'], ['jacket', 'orange'], ['coat', 'darkblue'], ['trousers', 'blue'], ['cap', 'orange']].map(x => __sayit.groupe(x[0], x[1])));
    note(JSON.stringify(g) === JSON.stringify(['a red cap', 'red shoes', 'an orange jacket', 'a dark blue coat', 'blue trousers', 'an orange cap']), 'Bonus : ' + g.join(', '));
    const tous = await jeu(page, () => {
      const out = [];
      __sayit.MOTS.filter(m => m.fiche === 'clothes').forEach(h => __sayit.MOTS.filter(m => m.fiche === 'colors').forEach(c => {
        const e = __sayit.etiquettes(h.id, c.id); out.push({ s: "I'm wearing " + __sayit.groupe(h.id, c.id), bon: e.bon.join(' '), trop: e.toutes.length - e.bon.length });
      }));
      for (let k = 0; k < 200; k++) out.push({ s: __sayit.carteQui().phrase });
      return out;
    });
    const fautes = tous.filter(x => / an? (dark blue|[a-z]+) (shoes|socks|trousers|shorts)\b/.test(x.s) || / a orange/.test(x.s) || /(cap|coat|jacket|shirt|T-shirt|dress|skirt|jumper|hoodie) (red|blue|yellow|green|grey|pink|purple|black|white|brown|orange)/.test(x.s) || (x.bon && x.bon !== x.s));
    note(!fautes.length, `Bonus : ${tous.length} bonnes réponses vérifiées, jamais « a red shoes », « a cap red » ni « a orange cap »` + (fautes.length ? ' : ' + fautes.slice(0, 3).map(x => x.s).join(' / ') : ''));
    const piege = tous.filter(x => /(shoes|socks|trousers|shorts)$/.test(x.s)).every(x => x.trop === 1);
    note(piege, 'Bonus : une étiquette « a » en trop pour shoes, socks, trousers, shorts');
    await page.click('#bBonus');
    await page.screenshot({ path: 'captures/bonus.png' });
    await page.click('#bLecon');
    await page.screenshot({ path: 'captures/lecon.png', fullPage: true });
    await page.click('#bJouerLecon');
    let n = 0;
    while ((await etat(page)).vue === 'vJeu' && n < 10) { await jeu(page, k => k === 1 ? __sayit.faux() : __sayit.juste(), n); n++; }
    const bo = await jeu(page, () => __sayit.bonus()), e = await etat(page), p2 = await jeu(page, () => __sayit.progres());
    note(e.vue === 'vFin' && n === 6 && bo.essais === 6 && bo.reussites === 5 && bo.parties === 1 && p2.cap.boite === 2,
      `Bonus joué : 6 questions (étiquettes et « Qui porte quoi ? »), 5 réussites notées, les boîtes des mots ne bougent pas`);
    note(!erreurs.length, 'Console sans erreur (bonus)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 6. La fiche, le coin des parents, « Tout recommencer », sans voix
  {
    const erreurs = [], page = await nouvellePage(browser, 390, 844, erreurs, { stockage: { 'marc.anglais.progres': tousVus(3), 'marc.anglais.journal': { jours: {}, tour: true, paquets: {}, jumeaux: {} } } });
    await page.click('[data-fiche="colors"]');
    const cache = await page.$eval('[data-case="yellow"] .mot', m => getComputedStyle(m).visibility);
    await page.click('[data-case="yellow"]');
    await page.waitForTimeout(1200);
    const leve = await page.$eval('[data-case="yellow"]', c => c.classList.contains('leve') && getComputedStyle(c.querySelector('.mot')).visibility === 'visible');
    const dit = await page.evaluate(() => window.__paroles.map(p => p.t).join(' | '));
    await page.screenshot({ path: 'captures/fiche-colors.png', fullPage: true });
    note(cache === 'hidden' && leve && /Yellow\. \| It's yellow\./.test(dit), 'La fiche : le mot est caché, toucher la tache la soulève et la voix dit « Yellow. It\'s yellow. »');
    await page.click('#bRecacher');
    const recache = await page.$$eval('#vFiche .case.leve', l => l.length);
    await page.click('#bRetour'); await page.click('[data-fiche="clothes"]');
    await page.click('[data-case="hoodie"]'); await page.waitForTimeout(1200);
    await page.screenshot({ path: 'captures/fiche-clothes.png', fullPage: true });
    const pr0 = await jeu(page, () => __sayit.progres());
    note(recache === 0 && JSON.stringify(pr0) === JSON.stringify(await jeu(page, () => __sayit.progres())), '« Tout recacher » ; la fiche ne compte pas dans les révisions');
    // Fiche Clothes : le dessin occupe l'essentiel de la case, la tache-cache reste une petite étiquette (téléphone et ordinateur portable)
    const proportions = async (pg) => pg.evaluate(() => [...document.querySelectorAll('#vFiche .case.habit')].map(c => {
      const k = c.getBoundingClientRect(), i = c.querySelector('.img').getBoundingClientRect(), r = c.querySelector('.rabat').getBoundingClientRect();
      return { img: i.height / k.height, rab: r.height / i.height };
    }));
    const okProp = l => l.length === 13 && l.every(x => x.img >= .6 && x.rab <= .45);
    const propTel = await proportions(page);
    const ordi = await browser.newPage({ viewport: { width: 1366, height: 600 } });
    await ordi.addInitScript(r => localStorage.setItem('marc.anglais.reglages', r), REGLAGES);
    await ordi.goto(URL + '?nocache=' + Date.now()); await ordi.waitForFunction(() => window.__sayit);
    await ordi.evaluate(() => __sayit.fiche('clothes'));
    const propOrdi = await proportions(ordi);
    await ordi.screenshot({ path: 'captures/fiche-clothes-1366x600.png', fullPage: true });
    await ordi.close();
    note(okProp(propTel) && okProp(propOrdi), 'Fiche Clothes : le dessin prend au moins 60 % de la case et la tache-cache reste petite, au téléphone et sur ordinateur portable');
    await page.click('#bRetour'); await page.click('#bParent');
    await page.screenshot({ path: 'captures/parents.png', fullPage: true });
    const txt = await page.evaluate(() => document.querySelector('#vParent').innerText);
    note(/Mots sus.*25 sur 25/.test(txt) && /hoodie/.test(txt) && /7 derniers jours/.test(txt) && /Voix : Test UK/.test(txt), 'Coin des parents : mots sus, boîtes, 7 jours, voix trouvée, rappel jumper / hoodie');
    await page.click('#pZero');
    await page.screenshot({ path: 'captures/recommencer.png' });
    await page.click('#cOui');
    const vide = await jeu(page, () => Object.keys(__sayit.progres()).length === 0 && !__sayit.etat().tour);
    note(vide, '« Tout recommencer » demande dans l\'appli (pas de fenêtre du navigateur), puis efface les progrès');
    note(!erreurs.length, 'Console sans erreur (fiche, parents)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
    // Sans aucune voix anglaise : un message, et l'appli marche à l'écrit
    const err2 = [], p2 = await nouvellePage(browser, 390, 844, err2, { sansVoix: true });
    const avis = await p2.evaluate(() => { const a = document.querySelector('#aVoix'); return a && !a.hidden ? a.textContent : ''; });
    await p2.click('#bJour'); await p2.evaluate(() => __sayit.juste());
    note(!err2.length && (await etat(p2)).run.i === 1 && (avis !== '' || await p2.evaluate(() => !!__sayit.voix())), 'Sans voix anglaise : message « pas de voix anglaise » et l\'appli marche à l\'écrit' + (err2.length ? ' : ' + err2.join(' / ') : ''));
    await p2.close();
  }

  // 7. Hors ligne après une première visite
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(URL);
    await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
    await page.reload(); await page.waitForTimeout(500);
    await ctx.setOffline(true);
    let ok = false;
    try { await page.reload(); ok = await page.evaluate(() => !!window.__sayit && document.title === 'Say it!'); } catch (e) { /* hors ligne raté */ }
    note(ok, 'Fonctionne hors ligne après une première visite');
    await ctx.close();
  }

  // 8. L'appli apparaît sur « Mes applis », thème « Anglais »
  if (LIVE) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('https://lechampdelaurore-boop.github.io/?nocache=' + Date.now());
    let ok = false;
    // Les thèmes de l'accueil sont repliés au départ : le lien existe sans être visible.
    try { await page.waitForSelector('a[href*="say-it"]', { state: 'attached', timeout: 30000 }); ok = true; } catch (e) { /* pas trouvée */ }
    const theme = ok ? await page.evaluate(() => { const u = document.querySelector('a[href*="say-it"]').closest('ul'); return u ? u.id : ''; }) : '';
    if (ok) await page.evaluate(() => { const u = document.querySelector('a[href*="say-it"]').closest('ul'); if (u) u.hidden = false; });
    await page.screenshot({ path: 'captures/mes-applis.png', fullPage: true });
    note(ok && theme === 'liste-anglais', `L'appli apparaît sur « Mes applis »${theme ? ' (thème ' + theme.replace('liste-', '') + ')' : ''}`);
    await page.close();
  }

  await browser.close();
  const rapport = '| | Vérification |\n|---|---|\n' + lignes.join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Test téléphone (site en ligne)\n\n' + rapport + '\n\nNon testable ici : la vraie voix anglaise du téléphone (qualité, voix iPhone) et l\'avis de l\'enfant.\n');
  console.log(echec ? '\nAu moins une vérification a échoué.' : '\nTout est bon.');
  process.exit(echec ? 1 : 0);
})();
