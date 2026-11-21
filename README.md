# Say it!

Les **couleurs** et les **vêtements** en anglais, comme sur la fiche de la classe de CM2, sur téléphone ou tablette, 5 minutes par jour.

👉 **[Ouvrir l'appli](https://lechampdelaurore-boop.github.io/say-it/)**

On retrouve la fiche : 12 **taches de peinture** (*What color is it? → It's yellow.*) et 13 **petits dessins** de vêtements (*What are you wearing today? → I'm wearing a cap.*). On touche, on **dit le mot à voix haute**, on soulève la tache, et la voix anglaise dit la phrase.

- **Mon anglais du jour** : 12 cartes au plus. D'abord les mots à revoir, puis un paquet de 4 nouveaux mots (2 couleurs + 2 vêtements, jamais deux mots qui se ressemblent ensemble). Le tout premier jour, un petit **tour de la fiche** repère les mots déjà connus.
- Quatre sortes de cartes : **dis-le, puis soulève** ; **écoute et touche** la bonne image ; **regarde et choisis** le mot écrit ; **les jumeaux** (*shirt / skirt*, *grey / green*…) quand les deux mots sont connus.
- Un mot ne monte de boîte que si **l'appli a vérifié** qu'il est su (pas seulement « Je l'avais dit »). Il revient le lendemain, puis 3, 7 et 21 jours après ; un raté redescend d'une boîte et revient le lendemain. Un mot est « su » après 3 jours réussis.
- **La fiche** : le mode libre, comme en classe, pour découvrir et revoir (ne compte pas dans les révisions).
- **Bonus « Je m'habille »** : la couleur passe devant (*a red cap*), pas de *a* devant *shoes, socks, trousers, shorts*, *an orange jacket*. Range les étiquettes, et « Qui porte quoi ? ».
- Pas de français pendant l'exercice : il apparaît en petit après la réponse (réglable). Voix anglaise britannique du téléphone, 🔊 partout, 🐢 pour réécouter lentement. **Pas de micro.**

*a jumper* est un pull en maille (le mot de la fiche) ; le sweat à capuche dessiné sur la fiche de l'école se dit *a hoodie* : l'appli apprend les deux.

Les progrès restent sur l'appareil. Seul un compteur de visites anonyme (GoatCounter) compte les ouvertures de l'appli : pas de cookie, pas de nom, rien sur les progrès. L'appli marche hors ligne et s'installe sur l'écran d'accueil.

## Réglages ⚙

Sons, animations, voix lente, français après la réponse, choix de la voix anglaise (automatique : britannique d'abord, sinon américaine). Les animations respectent aussi le réglage « réduire les animations » du téléphone.

Le **coin des parents** (lien en bas de l'accueil) montre les 25 mots avec leur boîte et la date de la prochaine révision, les mots les plus souvent ratés, les 7 derniers jours, la voix trouvée (avec un bouton pour la tester) et permet de tout recommencer. S'il n'y a pas de voix anglaise sur l'appareil, il faut en installer une dans les réglages du téléphone ; l'appli marche quand même à l'écrit.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque), dessins et personnages compris. Le contenu est entre `// DÉBUT FICHES` et `// FIN FICHES` : ajouter une fiche de classe plus tard (animaux, nourriture…) = ajouter une fiche, ses dessins et son ordre, sans toucher au reste.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `icons/` : icône de l'appli ; `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `docs/cahier-des-charges.md` : le cahier des charges (contenu, écrans, méthode et ses sources).
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran) avec une voix anglaise simulée, vérifie que chaque sorte de carte tient sans défiler, l'absence de français avant la réponse, le tour de la fiche, une séance du jour complète (12 cartes au plus), les boîtes sur 40 jours simulés, le bonus, la fiche, le coin des parents, le mode hors ligne, la présence sur « Mes applis » (thème Anglais) et l'absence d'erreur dans la console. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs http://localhost:8000/`.

## Plus tard

- Écrire les mots au clavier (orthographe).
- D'autres fiches de la classe.
