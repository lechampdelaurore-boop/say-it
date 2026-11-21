# Cahier des charges : appli d'anglais « Say it! » (couleurs et vêtements)

Version 1, 21 novembre 2026. Étape 2 du projet d'appli d'anglais (étape 1 : `recherche.md`, validée).
Statut : **validé le 21 novembre 2026** (contenu, dessins et icône). Dessins faits le 21 novembre 2026 dans `dessins/` (planches `planche-*.png`, `enfant-*.png`, source `vetements.js`), montrés avant intégration (§ 9).

**Nom proposé** : « Say it! » (« Dis-le ! » : c'est le geste central de l'appli, dire le mot avant de soulever la tache). Nom court du manifeste : « Say it! ». **Dépôt** : `lechampdelaurore-boop/say-it` (public, GitHub Pages sur main), site `https://lechampdelaurore-boop.github.io/say-it/`. Nom choisi le 21 novembre 2026 (modifiable plus tard).

**Première appli d'un nouveau thème « Anglais »** sur « Mes applis ».

Ce cahier des charges ne contient rien de privé et peut aller dans le dépôt public.

---

## 0. En bref

- On retrouve **la fiche de la classe** : 12 **taches de peinture** (couleurs) et 13 **petits dessins** (les 12 vêtements de la fiche + *a hoodie*). On touche, on **dit le mot à voix haute**, on soulève, on **entend la phrase** : *It's yellow.* / *I'm wearing a cap.*
- **« Mon anglais du jour »** : 5 minutes, une douzaine de cartes. L'appli choisit les mots à revoir (révisions espacées sur plusieurs jours) et les nouveaux mots **par paquets de 4**, couleurs et vêtements **mélangés**.
- Trois façons de s'entraîner : **dis-le puis soulève**, **écoute et touche la bonne image**, **regarde et choisis le mot écrit**. Plus **« Les jumeaux »** pour les mots qui se ressemblent (*shirt / skirt*, *grey / green*…), une fois les deux connus.
- **Bonus « Je m'habille »** : la couleur passe **devant** le vêtement (*a red cap*), et pas de *a* devant *shoes, socks, trousers, shorts*.
- **Pas de français** à l'écran pendant l'exercice (seulement après la réponse, en petit). **Voix anglaise britannique**, bouton 🔊 partout, 🐢 pour réécouter lentement. **Pas de micro.**
- Même famille que les autres applis : un seul `index.html`, charte kawaii, 30 créatures, profil commun, PWA hors ligne, rien envoyé en ligne sauf le compteur anonyme.

## 1. Pour qui, pour quoi

- **Public** : un élève de CM2 (10 ans) et ses camarades. Aucun prénom en dur : le prénom vient du profil commun `marc.profil`.
- **But** : savoir **dire** (et reconnaître à l'oral et à l'écrit) les 12 couleurs et les 12 vêtements de la fiche (plus *a hoodie*, § 2.2), **dans la phrase** de la classe, et bonus : les combiner (*I'm wearing a blue jumper.*).
- **Usage** : seul, 5 minutes par jour. En 1 à 2 semaines, les 25 mots doivent être solides.
- **Ce que dit la recherche, et qu'on applique** (détails dans `recherche.md`) :
  - **se tester bat relire** (Karpicke et Roediger 2008) → on dit le mot **avant** de soulever ;
  - **espacer** les révisions sur plusieurs jours, y compris en primaire (Cepeda et al. 2006 ; Goossens et al. 2012) → boîtes de Leitner ;
  - **image directe**, pas de traduction, mais l'image donne une **fausse impression de savoir** (Carpenter et Olson 2012) → c'est l'appli qui vérifie, pas seulement l'impression de l'enfant ;
  - **dire à voix haute** fait mieux retenir (MacLeod et al. 2010) → consigne « Dis-le à voix haute » à chaque carte ;
  - **ne pas tout apprendre d'un bloc par catégorie** (Tinkham 1993 ; Erten et Tekin 2008) → paquets de 4 mélangés, paires pièges séparées au début ;
  - **règle explicite + pratique** pour l'ordre des mots (Norris et Ortega 2000 ; Spada et Tomita 2010) → mini-leçon du bonus ;
  - **correction immédiate** avec la bonne réponse et le son (Metcalfe 2017).

## 2. Le contenu

Orthographe **exactement comme sur la fiche de classe** (*What color is it?*, *grey*, *T-shirt*).

### 2.1 Fiche « Colors » : *What color is it?* → *It's yellow.*

| Anglais | Français (affiché seulement après la réponse) | Remarque |
|---|---|---|
| yellow | jaune | |
| brown | marron | jumeau de *blue* |
| blue | bleu | jumeau de *brown* et de *dark blue* |
| dark blue | bleu foncé | deux mots |
| white | blanc | tache blanche avec contour foncé (lisible en clair et en sombre) |
| black | noir | |
| pink | rose | |
| purple | violet | |
| grey | gris | jumeau de *green* |
| green | vert | jumeau de *grey* |
| orange | orange | même mot qu'en français, prononciation différente : la voix compte |
| red | rouge | |

Phrase de réponse : *It's yellow.* (*It's dark blue.*)

### 2.2 Fiche « Clothes » : *What are you wearing today?* → *I'm wearing…*

| Anglais | Français | Phrase de réponse | Jumeaux |
|---|---|---|---|
| a cap | une casquette | *I'm wearing a cap.* | |
| shoes | des chaussures | *I'm wearing shoes.* | socks |
| socks | des chaussettes | *I'm wearing socks.* | shoes |
| a coat | un manteau | *I'm wearing a coat.* | jacket |
| a skirt | une jupe | *I'm wearing a skirt.* | shirt, dress |
| a dress | une robe | *I'm wearing a dress.* | skirt |
| trousers | un pantalon | *I'm wearing trousers.* | shorts |
| shorts | un short | *I'm wearing shorts.* | trousers |
| a T-shirt | un T-shirt | *I'm wearing a T-shirt.* | shirt |
| a shirt | une chemise | *I'm wearing a shirt.* | skirt, T-shirt |
| a jumper | un pull (en maille, sans capuche) | *I'm wearing a jumper.* | jacket, hoodie |
| a jacket | une veste | *I'm wearing a jacket.* | jumper, coat |
| a hoodie | un sweat à capuche | *I'm wearing a hoodie.* | jumper |

**Ajout du 21 novembre 2026 : *a hoodie*.** Sur la fiche de l'école, *a jumper* est dessiné comme un sweat à capuche. Or en anglais britannique, *a jumper* est un **pull** (en maille, sans capuche) ; un sweat à capuche se dit ***a hoodie*** (au Royaume-Uni comme aux États-Unis). Choix des parents : garder *a jumper* avec un vrai pull (le mot de la maîtresse, avec son sens juste) et **ajouter *a hoodie*** avec le sweat à capuche, pour apprendre le bon mot. Les parents expliquent la différence à l'enfant pour la classe. Dans le coin des parents, une ligne le rappelle.

Le mot s'affiche **avec son *a*** quand il en a un (*a cap*), comme sur la fiche. Les pluriels (*shoes, socks, trousers, shorts*) n'en ont jamais.

### 2.3 Les jumeaux (paires pièges)

*shirt / skirt*, *grey / green*, *blue / brown*, *blue / dark blue*, *jumper / jacket*, *coat / jacket*, *shoes / socks*, *trousers / shorts*, *skirt / dress*, *T-shirt / shirt*, *jumper / hoodie*.
Ils ne sont **jamais dans le même premier paquet**. « Les jumeaux » ne s'ouvre pour une paire que quand les deux mots ont été réussis au moins 2 jours différents.

### 2.4 Pensé pour les prochaines fiches

Le contenu est une liste de **fiches** dans le code : chaque fiche a un titre, une question (texte + audio), et des mots (anglais, français, *a* ou non, phrase de réponse, dessin ou couleur, jumeaux). Ajouter plus tard une fiche de classe (animaux, nourriture, la maison…) = ajouter une fiche et ses dessins, sans toucher au reste.

## 3. Les écrans

En-tête commun partout : 🏠 (vers « Mes applis ») · « Say it! » · ⚙.

1. **Accueil**
   - Bonjour + prénom du profil.
   - Bouton bleu (le seul) : **« ▶ Mon anglais du jour »** (avec « 5 min » et le nombre de cartes).
   - Deux grandes cartes : **🎨 Colors** et **👕 Clothes** (= la fiche de la classe, § 4), avec une petite barre « mots sus ».
   - Carte **⭐ Bonus : Je m'habille** (§ 6). Toujours ouverte ; un badge soleil « Prêt ! » apparaît quand assez de mots sont sus.
   - En bas, petit lien « Coin des parents ».
2. **La fiche** (§ 4).
3. **Mon anglais du jour** (§ 5), une carte à la fois, puis l'écran **Bravo**.
4. **Bonus « Je m'habille »** (§ 6).
5. **Coin des parents** (§ 10).
6. **⚙ Réglages** : sons, animations, vitesse de la voix (normale / lente), afficher le français après la réponse (oui par défaut), voix choisie.

Tout tient sur un téléphone de 320 × 568 sans défiler pendant un exercice. Boutons ≥ 56 px. Thème sombre automatique.

## 4. La fiche (comme en classe)

- En haut, la question, avec 🔊 : *What color is it?* ou *What are you wearing today?*
- Une grille de 12 cases pour Colors, 13 pour Clothes (3 colonnes sur téléphone, 4 ou 6 sur tablette).
  - **Colors** : chaque case est **une tache de peinture** de la couleur. Le mot est **caché dessous**.
  - **Clothes** : chaque case montre **le petit dessin** ; le mot est caché sous une **tache de peinture claire** posée à côté (comme un rabat).
- **Toucher une case** : la consigne « Dis-le à voix haute… » s'affiche 1 seconde, puis **la tache se soulève** (petite animation de coin qui se décolle ; sans animation si mouvement réduit) et montre le mot écrit. La voix dit **le mot puis la phrase** : « *Yellow. It's yellow.* ».
- Toucher à nouveau : réécouter. Bouton 🐢 : réécouter lentement.
- Un bouton **« Tout recacher »**.
- C'est un mode **libre**, pour découvrir et revoir. Il ne compte pas dans les révisions (la recherche dit que relire seul apporte peu ; c'est « Mon anglais du jour » qui fait progresser).

## 5. « Mon anglais du jour » (5 minutes)

### 5.1 Ce qu'il y a dans une séance

- **12 cartes au plus** (environ 5 minutes). D'abord les mots **à revoir aujourd'hui**, puis, s'il reste de la place, **un paquet de 4 nouveaux mots** (au plus un paquet par jour, deux si aucun mot n'est à revoir).
- Paquets de nouveaux mots : **2 couleurs + 2 vêtements**, jamais deux jumeaux dans le même paquet. Ordre proposé : *yellow, a cap, black, socks* / *red, a coat, white, trousers* / *pink, a dress, green, a T-shirt* / *orange, a jumper, blue, shoes* / *purple, a skirt, grey, shorts* / *brown, a shirt, dark blue, a jacket* / puis *a hoodie* seul, ajouté au premier paquet qui a de la place une fois *a jumper* en boîte 2.
- Les cartes sont **mélangées** (couleurs et vêtements ensemble).
- **Premier lancement** : un petit **« Tour de la fiche »** (environ 3 minutes) : chaque mot une fois en « écoute et touche » (§ 5.2 b). Les mots déjà reconnus sautent l'étape « nouveau mot » et passent directement en boîte 1 (revus demain). Cela évite de réapprendre ce qu'il sait déjà de la classe.

### 5.2 Les quatre sortes de cartes

**a. Dis-le, puis soulève** (le rappel, cœur de l'appli)
- On voit la tache ou le dessin, on entend la question (*What color is it?*).
- Consigne : « Dis-le à voix haute, puis soulève ! ». Le bouton « Soulever » n'est actif qu'après 2 secondes (le temps d'essayer de dire le mot).
- La tache se soulève : mot écrit + voix (*It's purple.*). Puis deux boutons : **« Je l'avais dit ! 😊 »** / **« Pas encore 🤔 »**.
- « Pas encore » : le mot revient plus loin dans la séance.

**b. Écoute et touche** (sans lecture)
- On entend *It's purple.* (🔊 pour réécouter). On touche la bonne image parmi **4**.
- Les 3 autres images : si possible un jumeau, sinon des mots de la même fiche.

**c. Regarde et choisis** (lecture)
- On voit l'image. On choisit le **mot écrit** parmi 4 (pièges : les jumeaux, par exemple *a shirt / a skirt / a T-shirt / a dress*). Pour les vêtements, les propositions ont leur *a* ou non, comme sur la fiche.
- Après la réponse, la voix dit toujours la phrase complète.

**d. Les jumeaux**
- On entend un mot d'une paire piège ; on touche **l'une des deux images**. 4 à 6 questions rapides sur la même paire, dans le désordre.
- N'apparaît que pour les paires où les deux mots sont connus (§ 2.3), au plus une fois par séance.

### 5.3 Ce qui compte pour les révisions

- Comme le montrent Carpenter et Olson, l'image donne une fausse impression de savoir. Donc **un mot ne monte de boîte que si l'enfant le réussit dans une carte vérifiée par l'appli** (b, c ou d) **et** ne s'est pas dit « Pas encore » sur la carte a.
- Chaque mot à revoir passe donc par **une carte a**, puis plus loin dans la séance **une carte b ou c** (b pour les mots récents, c à partir de la boîte 2).
- Seul le **premier essai du jour** compte (comme dans « Mots à retenir »).

### 5.4 Réponses

- **Juste** : la carte rebondit, fond menthe pâle, la voix dit la phrase, une étoile.
- **Faux** : la carte secoue la tête, le téléphone vibre, fond pêche pâle ; la **bonne image s'allume**, la voix dit la phrase, et le français apparaît en petit (« purple = violet »). Pas de personnage, pas de son agressif. Le mot revient plus loin dans la séance.
- **Écran Bravo** : étoiles de la séance, **un des 30 personnages** arrive, « Mots sus : 9 sur 25 », et « À demain ! ».

## 6. Bonus « Je m'habille » (couleur + vêtement)

Ouvert tout le temps. Badge « Prêt ! » quand au moins 6 couleurs et 6 vêtements sont en boîte 2 ou plus ; avant, un petit conseil : « Apprends d'abord quelques mots dans Mon anglais du jour ». Les exercices n'utilisent **que des mots déjà vus**.

1. **Mini-leçon** (une seule page, réécoutable) : un dessin de casquette rouge. « En anglais, **la couleur passe devant** : *a red cap* = une casquette rouge. » Puis : « Pas de *a* devant *shoes, socks, trousers, shorts* : *red shoes*, *blue trousers*. » Et : « *dark blue* reste ensemble devant : *a dark blue coat*. » Et : « devant *orange*, *a* devient ***an*** : *an orange jacket*. »
2. **Range les étiquettes** : on voit un vêtement colorié (*une casquette rouge*), on remet les étiquettes dans l'ordre : `I'm wearing` `a` `red` `cap`. Pour les pluriels, il y a une étiquette `a` **en trop** à laisser de côté (le piège du *a*). Correction : les étiquettes mal placées secouent la tête, la bonne phrase est dite.
3. **Qui porte quoi ?** : on entend *I'm wearing a blue jumper and black shoes.* On touche le bon personnage parmi **3** (les deux autres ont un détail qui change : *black jumper and blue shoes*, ou *a blue jacket*).
4. Score en étoiles, un personnage à la fin. Le bonus **ne compte pas** dans les boîtes des mots (il les réutilise seulement), mais garde son propre nombre de réussites.

Les personnages à habiller : **un petit enfant kawaii neutre** (même style et même contour que les 30 créatures), dessiné exprès, avec des vêtements que l'on peut colorier dans les 12 couleurs. À montrer avant intégration (§ 9).

## 7. Révisions espacées (boîtes de Leitner par mot)

- Boîte 0 = nouveau. Réussite (au sens du § 5.3) → boîte suivante. Écarts : boîte 1 → revu **le lendemain**, boîte 2 → **3 jours**, boîte 3 → **7 jours**, boîte 4 = **trésor** → **21 jours**.
- Raté → **revu demain**, et redescend d'une boîte (jamais sous la boîte 1).
- Un mot est **« su »** à partir de la boîte 3 (réussi au moins 3 jours différents). Avec une séance par jour, les 25 mots peuvent être sus en 1 à 2 semaines.
- Pas de séance un jour : rien n'est perdu, les mots en retard passent en premier (12 cartes au plus).

## 8. Voix et son

- `speechSynthesis` du téléphone. Voix choisie dans cet ordre : **anglaise britannique (en-GB)**, sinon américaine (en-US), sinon toute voix anglaise. Si aucune : message pour les parents (« Installez une voix anglaise dans les réglages du téléphone ») et l'appli marche quand même à l'écrit.
- Vitesse normale 0,9 ; 🐢 = 0,7.
- Bouton 🔊 sur la question, sur chaque tache et chaque dessin. La voix part toute seule quand on soulève ou après une réponse.
- **Pas de micro, pas de reconnaissance vocale** : elle reconnaît mal les voix d'enfants et enverrait souvent l'audio en ligne. L'enfant dit le mot, puis compare lui-même avec la voix.
- Petits sons Web Audio (soulever, juste, faux doux), désactivables.

## 9. Les dessins (à montrer avant intégration)

Une **planche** sera faite et montrée avant le code de l'appli, en clair et en sombre :

- **13 vêtements**, style kawaii de la charte (contour `#2B2340`, 3 px, formes rondes), **sans ambiguïté** :
  - *shirt* : col + boutons + manches longues ; *T-shirt* : col rond, manches courtes, sans boutons ;
  - *jumper* : col rond, poignets et bas côtelés, motif tricot, sans fermeture ni capuche ;
  - *hoodie* : capuche, cordons, poche kangourou, sans motif tricot ; *jacket* : courte, ouverte avec fermeture éclair ; *coat* : long (sous les genoux), gros boutons ;
  - *skirt* : seule (taille + jupe) ; *dress* : avec le haut et des bretelles ou manches ;
  - *trousers* : jambes jusqu'aux pieds ; *shorts* : jambes au-dessus des genoux ;
  - *shoes* : paire de chaussures (lacets) ; *socks* : paire de chaussettes (sans semelle) ; *cap* : casquette à visière.
- Chaque vêtement doit pouvoir être **colorié dans les 12 couleurs** (pour le bonus), le blanc restant lisible grâce au contour.
- Dans la fiche Clothes, chaque vêtement a une couleur fixe, variée, **choisie pour ne pas induire en erreur** (pas de *jumper* gris à côté de la tache *grey*).
- Les dessins sont posés sur un **fond « papier » clair, même en thème sombre** (sinon le noir et le bleu foncé ne se voient pas).
- **12 taches de peinture** (formes de taches irrégulières, différentes entre elles) et la **tache-rabat** claire des vêtements.
- **L'enfant kawaii à habiller** (bonus), validé.
- **Icône de l'appli** : une casquette rouge, une tache de peinture bleue et une bulle « a red cap! », sur fond ciel (`dessins/icone-et-theme.png`).
- **Thème « Anglais » sur « Mes applis »** : pastille avec **deux drapeaux dessinés** (britannique et américain), en SVG et pas en emoji (les emojis de drapeaux s'affichent en lettres sur Windows).

## 10. Coin des parents

- Les 25 mots avec leur boîte (pastilles), la date de la prochaine révision, et les 3 mots les plus souvent ratés.
- Les 7 derniers jours : séances faites, étoiles.
- Voix trouvée sur l'appareil (et bouton « Tester la voix »).
- « Tout recommencer » (avec confirmation dans l'appli, pas de fenêtre du navigateur).

## 11. Données (localStorage)

- `marc.anglais.progres` : par mot, `{boite, prochaine, dernierJour, reussites, rates}`.
- `marc.anglais.journal` : séances par jour (cartes, étoiles).
- `marc.anglais.bonus` : réussites du bonus.
- `marc.anglais.reglages` : sons, animations, vitesse, français après réponse, voix.
- Lecture seule de `marc.profil` (prénom, compagnon) et écriture de `marc.accueil.derniere` comme les autres applis.

## 12. Charte, technique, mise en ligne

- Un seul `index.html` (HTML, CSS, JavaScript sans librairie ni build), `marc-design.css` collé en haut du `<style>`, polices Fredoka et Nunito dans `fonts/`, les 30 créatures (`creatures.js` collé dans le fichier).
- Règles de couleurs de la charte : un seul bouton bleu par écran, menthe = juste, pêche = à retenter, jamais de rouge (sauf la tache *red* elle-même, qui est du contenu). `prefers-reduced-motion` respecté, `<html class="calme">` coupe tout.
- PWA : `manifest.webmanifest`, `sw.js` (CACHE `say-it-v1`, incrémenté à chaque mise à jour), icônes 192/512/maskable, apple-touch-icon, hors ligne.
- « Mes applis » : `<meta name="appli-marc" content="oui">`, **`<meta name="appli-theme" content="anglais">`**, lien 🏠 vers `/`. Le hub doit recevoir un **nouveau thème « Anglais »** (une PR sur le dépôt du hub : ajout dans `THEMES` avec une couleur pêche et la pastille aux deux drapeaux en SVG au lieu d'un emoji, et son test en ligne).
- Compteur de visites GoatCounter anonyme, même extrait que les autres applis, + la phrase du README.
- Aucun prénom d'enfant écrit en dur (ni dans l'appli, ni le README, ni les commentaires).
- Tests : `tests/telephone.cjs` + action « Test téléphone » sur le site en ligne (7 tailles de téléphone, voix anglaise simulée, séance complète, Leitner sur plusieurs jours simulés, bonus, hors ligne, apparition sur « Mes applis » avec `waitForSelector(..., {state:'attached'})`). Accroche de test `window.__sayit`.
- Création du dépôt : par le fil de contrôle à distance sur le PC (les fils dans le cloud ne peuvent pas créer de dépôt).

## 13. Ce qui n'est pas dans la version 1

- Écrire les mots anglais au clavier (orthographe) : possible plus tard.
- Micro et vérification de la prononciation.
- D'autres fiches (animaux, nourriture…) : la structure est prête (§ 2.4), le contenu viendra des prochaines fiches de classe.
- Choix entre voix britannique et américaine dans les réglages (la voix est choisie automatiquement).

## 14. Critères de réussite

- Sur un téléphone de 320 × 568, chaque exercice tient sans défiler, aucune erreur dans la console.
- Une séance du jour dure 4 à 6 minutes et ne dépasse jamais 12 cartes.
- Jamais deux jumeaux dans le même paquet de nouveaux mots ; jamais de français à l'écran avant la réponse.
- Un mot ne monte de boîte que par une réussite vérifiée par l'appli.
- Le bonus n'écrit jamais *a red shoes*, *a cap red* ni *a orange cap* dans ses bonnes réponses (*an orange cap*).
- L'appli apparaît sur « Mes applis » dans le thème « Anglais », marche hors ligne et s'installe sur l'écran d'accueil.
- **Non testable dans le cloud** (à vérifier sur le vrai téléphone) : la qualité de la voix anglaise, les voix iPhone, l'avis de l'enfant.

## 15. Choix faits seul (à confirmer)

1. ~~Le nom « Say it! »~~ : choisi le 21 novembre 2026.
2. Le « Tour de la fiche » au premier lancement pour ne pas réapprendre ce qu'il sait déjà (§ 5.1).
3. Le bouton « Soulever » qui attend 2 secondes, pour laisser le temps de dire le mot (§ 5.2 a).
4. Le bonus ouvert tout le temps, avec seulement un conseil (§ 6).
5. Le français affiché en petit après la réponse, désactivable (§ 3, réglages).
6. L'ordre des paquets de nouveaux mots (§ 5.1).
