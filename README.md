# Orbite — site d'agence web

Site commercial d'une agence de création de sites web, d'applications et de
référencement. React 18 + Vite, CSS maison, aucune dépendance au-delà de React.

Direction visuelle inspirée des sites d'agence à forte densité commerciale
(devis gratuit visible partout, téléphone en tête de page, services en
onglets, chiffres de preuve, calculateur de budget) avec sa propre palette,
sa propre typographie et ses propres textes.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle de production dans dist/
npm run preview  # servir le bundle construit
```

## Organisation

```
index.html                 polices Google, métadonnées, Open Graph
public/images/             vos photos réelles (voir A-LIRE.txt)
src/main.jsx               point d'entrée, marque <html class="has-js">
src/App.jsx                ordre des sections
src/data/site.js           TOUT le contenu éditorial
src/data/medias.js         TOUTES les images, en un seul endroit
src/styles/global.css      jetons de design + styles, dans l'ordre des sections
src/hooks/
  useTheme.js              thème clair/sombre, mémorisé dans le navigateur
  useReveal.js             apparition des blocs au défilement
  useActiveSection.js      surlignage du lien de nav de la section courante
src/components/            une section par fichier
```

### Sections, dans l'ordre

| Composant | Rôle |
|---|---|
| `Topbar` | téléphone, e-mail, délai de devis, sélecteur de langue |
| `Header` | nav collante, section active, thème, bouton Devis gratuit |
| `Hero` | accroche, photo, carte de positions Google |
| `Partners` | bandeau défilant de certifications |
| `Why` | quatre arguments différenciants |
| `ServiceTabs` | six services en onglets accessibles au clavier |
| `Ia` | offre IA : 6 prestations, méthode en 4 étapes, 4 engagements |
| `Stats` | bandeau bleu, chiffres animés à l'entrée dans le cadre |
| `Process` | la méthode, unique : six étapes, dont les variantes IA |
| `Work` | six réalisations avec le résultat obtenu |
| `Testimonials` | avis clients et note globale |
| `Team` | l'agence, mosaïque de bureaux, fiche du cofondateur |
| `Articles` | trois ressources |
| `Faq` | huit questions en accordéon |
| `CallToAction` | rappel téléphone + devis |
| `Contact` | coordonnées et formulaire |
| `Legal` | mentions légales, confidentialité, conditions (repliées) |
| `Footer` | services, bureaux, secteurs, mentions |

## Changer le contenu

L'offre IA vit dans trois tableaux de `src/data/site.js` : `servicesIA`
(les six prestations), `etapesIA` (audit → pilote → production → mesure) et
`gardesIA` (les engagements techniques : validation humaine, données en UE,
traçabilité, règlement européen sur l'IA). Les prix affichés sont des points
de départ commerciaux, pas des résultats clients — aucun chiffre de gain n'y
est avancé, puisqu'il se mesure pendant le pilote.

**Textes** → `src/data/site.js`. Nom de l'agence, coordonnées, services et
leurs prix, étapes, chiffres, réalisations, avis, articles, FAQ, bureaux,
secteurs. Les composants ne contiennent presque aucun texte figé ; les
exceptions sont le titre du héros (`Hero.jsx`) et les accroches de section.

**Images** → `src/data/medias.js`. Les six photos vivent dans
`public/images/` et sont servies par votre propre hébergement : **aucun appel
à un service tiers**, donc rien à déclarer côté RGPD et rien qui casse si un
service externe tombe. Le mapping photo → emplacement est en haut du fichier,
et `public/images/A-LIRE.txt` le résume.

Pour en remplacer une : déposez le fichier dans `public/images/`, puis changez
`src`, `l`, `h` et le texte alternatif dans `medias.js`. Si un fichier manque,
`<Media>` affiche un visuel dessiné à sa place — la mise en page ne casse
jamais, et le cadre réserve toujours sa hauteur, donc rien ne saute au
chargement.

### Deux précautions sur les photos actuelles

**Droits.** Les fichiers ont été fournis par le propriétaire du projet. Vérifiez
leur licence d'usage commercial avant la mise en ligne.

**Personnes reconnaissables.** `equipe-atelier.jpg` et `bureaux-plateau.jpg`
montrent des visages qui ne sont pas ceux de votre équipe. Les textes
alternatifs sont rédigés pour décrire une scène de travail sans affirmer qu'il
s'agit de vos salariés ou de vos locaux — ne les légendez pas « notre équipe ».

### Poids des images

Les six fichiers pèsent **2,9 Mo** au total, en 1920 px de large alors qu'ils
s'affichent sur 700 px au maximum. C'est le principal frein de performance du
site aujourd'hui. Avant la mise en production, redimensionnez-les et convertissez
-les en WebP ou AVIF — on descend typiquement sous 300 Ko pour l'ensemble :

```bash
npm i -D sharp
```

puis un script qui, pour chaque fichier, produit une version 1400 px et une
version 700 px en WebP, et un `srcset` dans `<Media>`. Seule la photo du héros
se charge immédiatement ; les cinq autres sont déjà en `loading="lazy"`.

## Système visuel

Les jetons sont en haut de `src/styles/global.css`, dans le bloc `:root` :

- **Couleur** — fond blanc et gris bleuté alternés, bleu pour la confiance et
  les liens, orange réservé aux boutons d'action, vert pour les résultats
  positifs. Le bandeau de chiffres en bleu plein est le seul moment contrasté.
- **Type** — Plus Jakarta Sans (titres), Hanken Grotesk (texte courant),
  IBM Plex Mono (chiffres et étiquettes techniques).
- **Structure** — cartes arrondies à ombre douce, grille qui se replie à une
  colonne sur téléphone.
- **Largeur** — `--cadre: 1920px` avec des gouttières fluides
  (`--marge: clamp(1.1rem, 3.5vw, 4.5rem)`). En pratique la page occupe tout
  l'écran jusqu'en 1920 px ; au-delà elle se centre pour que les lignes de
  texte ne deviennent pas illisibles. Pour aller vraiment bord à bord sur les
  écrans ultra-larges, retirez `max-width` de `.wrap`.

Deux séries de règles accompagnent cette largeur, en bas de la feuille de
styles : à partir de 1200 px les listes se figent sur un nombre de colonnes
choisi et les visuels cessent de grandir en hauteur ; à partir de 1600 px les
grilles de cartes gagnent une colonne au lieu d'élargir chaque carte.

Le thème clair est la valeur par défaut (`:root`), le sombre est défini sous
`prefers-color-scheme: dark` **et** sous `[data-theme="dark"]` pour que le
bouton de bascule gagne dans les deux sens. Toute nouvelle couleur doit passer
par un jeton, jamais par une valeur littérale dans une règle de composant.

## Contexte : entreprise québécoise

Le site est écrit pour une agence établie au Québec (Repentigny, Lanaudière).
Cela se traduit dans les données et les documents :

- `studio` porte **`neq`** (Registre des entreprises du Québec) et **`taxes`**
  (TPS/TVQ), pas de SIRET ni de TVA ;
- `studio.responsablePrp` existe parce que la **Loi 25** oblige toute
  entreprise qui recueille des renseignements personnels à désigner un
  responsable de leur protection — le formulaire de contact suffit à
  déclencher cette obligation, quel que soit l'hébergeur ;
- les trois documents de `legal` s'appuient sur la Loi 25, la Loi sur la
  protection du consommateur et le droit civil québécois. L'autorité de
  recours est la **Commission d'accès à l'information**, pas la CNIL ;
- `index.html` déclare `lang="fr-CA"` et `og:locale` en `fr_CA`.

**Sept champs restent à renseigner** dans `studio` avant toute mise en ligne :
`neq`, `forme`, `adresse`, `taxes`, `directeur`, `responsablePrp`, `hebergeur`.
Une ligne vide disparaît simplement du document — mais un document incomplet
ne vous protège pas. Faites relire le tout par un juriste.

Le numéro de téléphone par défaut est en **555-0190**, plage réservée à la
fiction en Amérique du Nord : il est volontairement faux.

## Pas de sélecteur de langue

Le site n'existe qu'en français. Le sélecteur FR/EN/ES du bandeau a été retiré
parce qu'il ne traduisait rien — et vendre des sites bilingues avec un bouton
factice sur son propre site est le pire des arguments. Le jour où la version
anglaise existe, il reprend sa place dans `Topbar.jsx`.

## Aucun prix sur le site

Le site n'affiche **aucun montant**. Le prix se donne après l'appel de
cadrage, dans un devis écrit. Concrètement :

- les onglets de services affichent un **délai**, pas un tarif ;
- les cartes de l'offre IA affichent « Sur devis » ;
- il n'y a **pas de section tarifs** : le devis gratuit se demande depuis le
  bouton de l'en-tête, les appels à l'action et le formulaire ;
- le formulaire demande **une échéance** (`echeances`), pas un budget ;
- la FAQ répond « quels sont vos tarifs ? » et « comment se passe le
  paiement ? » — c'est là que ces questions se traitent, pas dans une section
  dédiée qui parlerait de l'agence au lieu de parler au client.

Si vous changez d'avis et voulez afficher des prix, ajoutez un champ `prix`
aux entrées de `services` et `servicesIA` dans `src/data/site.js`, puis
affichez-le dans `ServiceTabs.jsx` et `Ia.jsx` — les deux endroits portent
aujourd'hui une mention « sur devis » à remplacer.

## Formulaire

Le formulaire de contact valide côté client puis affiche l'accusé de réception.
**Il n'envoie rien** : il n'y a pas de serveur. Pour le brancher, remplacez le
commentaire dans `soumettre()` (`src/components/Contact.jsx`) :

```js
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(v),
});
setEnvoye(true);
```

Gérez l'échec réseau (afficher une erreur plutôt que l'accusé) et protégez le
point d'entrée contre les envois automatisés.

## Accessibilité et préférences

- Lien d'évitement vers le contenu, focus visible partout.
- Onglets de services pilotables aux flèches, `Début` et `Fin`.
- Accordéon FAQ et menu mobile câblés en `aria-expanded` / `aria-controls`.
- `prefers-reduced-motion` coupe les apparitions, le bandeau défilant, le
  comptage des chiffres et le tracé du soulignement.
- Sans JavaScript, le CSS laisse tous les blocs visibles.
- Images avec dimensions déclarées et chargement différé, sauf celle du héros.

## Mise en ligne

`npm run build` produit un dossier `dist/` entièrement statique, déployable sur
Vercel, Netlify, Cloudflare Pages ou tout hébergement de fichiers.

## Contenus de preuve : vides par défaut

Sept jeux de données sont **volontairement vides**, parce qu'ils affirment
quelque chose de vérifiable sur l'agence. Tant qu'ils le sont, la section
concernée affiche un état d'attente qui explique quoi y mettre, ou disparaît :

| Donnée (`src/data/site.js`) | Section | Comportement si vide |
|---|---|---|
| `realisations` | Réalisations | état d'attente + anatomie d'une carte |
| `avis` | Avis clients | état d'attente + anatomie d'un témoignage |
| `articles` | Ressources | état d'attente + anatomie d'un article |
| `chiffres` | Bandeau bleu | section masquée |
| `preuves` | Hero | rangée masquée |
| `badges` | Certifications | bandeau masqué |
| `bureaux` | Pied de page | seul le bloc de contact reste |

Même logique pour `direction` (la personne mise en avant dans la section
Agence) : tant que `nom` est vide, la fiche bascule sur un bloc de contact
neutre. Et pour `studio.siret`, masqué tant qu'il n'est pas renseigné.

### Ces blocs d'aide ne partent pas en production

Les états d'attente (« Aucune réalisation publiée », l'anatomie d'une carte,
le rappel du fichier à éditer) sont de l'**échafaudage de développement**. Ils
s'adressent à vous, pas au visiteur, et portent un bandeau orange
« Visible en développement uniquement ».

Ils n'apparaissent que sous `npm run dev`. Dans le site construit :

- les sections Réalisations, Avis clients et Ressources **disparaissent**
  entièrement tant que leurs données sont vides ;
- le lien « Réalisations » disparaît aussi de la navigation ;
- le code de ces blocs est **retiré du bundle** par le minifieur, grâce au
  motif `if (!import.meta.env.DEV) return null;` placé avant leur rendu.

Dès que vous ajoutez une entrée, la section réapparaît avec sa vraie grille,
sans rien changer d'autre.

Deux règles pour les remplir :

- **Un chiffre affiché doit pouvoir être justifié** si un client le demande.
- **Un nom de client ou de personne citée exige son accord**, sur le nom
  affiché comme sur le résultat annoncé.

## À faire avant une vraie mise en production

- Renseigner `studio` dans `src/data/site.js` : nom, téléphone, e-mail,
  adresse, SIRET, année de création. **Les valeurs actuelles sont des
  gabarits, pas des coordonnées réelles.**
- Remplir les sept jeux de données de preuve listés plus haut, au fur et à
  mesure que vous avez de quoi les remplir honnêtement.
- Optimiser les images (voir « Poids des images ») et vérifier leur licence.
- Ne mettre dans `badges` que les certifications réellement détenues : ce sont
  des marques déposées et des engagements opposables.
- Brancher le formulaire.
- Écrire les pages Mentions légales, Confidentialité et Conditions, aujourd'hui
  en lien mort dans le pied de page.
- Traduire le site si vous gardez le sélecteur de langue du bandeau haut, qui
  n'est pour l'instant qu'un repère visuel.
- Fournir une image Open Graph (`og:image`) pour l'aperçu des partages.
