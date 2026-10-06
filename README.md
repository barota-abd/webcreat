# Orbite — site d'agence web

Site d'une agence québécoise de création de sites web, d'applications et de
référencement. React 18 + Vite, CSS maison, **aucune dépendance au-delà de
React**.

Le site existe en **cinq habillages visuels complets**, interchangeables par
une ligne de configuration. Le contenu et les composants sont identiques dans
les cinq : seules changent la feuille de styles et les polices.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # site statique dans dist/
npm run preview  # servir le site construit, pour le voir tel qu'il sera publié
```

> `npm run dev` affiche deux aides qui **n'existent pas** dans le site
> construit : le sélecteur de design en bas à gauche, et les blocs d'attente
> des sections encore vides. Pour voir le site tel que le verra un visiteur,
> utilisez `npm run preview`.

## Organisation

```
design.config.js           LE DESIGN SERVI — une ligne, c'est ici qu'on change
vite.config.js             choisit la feuille de styles et écrit l'en-tête
index.html                 métadonnées et Open Graph

public/images/             les photos (voir A-LIRE.txt pour la liste)

src/main.jsx               point d'entrée : pose le design puis démarre React
src/App.jsx                l'ordre des sections de la page
src/designs.js             registre des designs, chargeurs de développement
src/designs.meta.js        fiche de chaque design : polices, couleurs, favicon

src/data/site.js           TOUT le contenu éditorial
src/data/medias.js         TOUTES les images, en un seul endroit

src/styles/designs/        une feuille complète et autonome par design
    commercial.css
    pilotage.css
    neon.css
    holographique.css
    terminal.css
    _vide.css              remplace la feuille en développement

src/hooks/
    useTheme.js            thème clair/sombre, mémorisé dans le navigateur
    useReveal.js           apparition des blocs au défilement
    useActiveSection.js    surlignage du lien de nav de la section courante

src/components/            une section par fichier
```

**Les deux fichiers que vous éditerez le plus** sont `src/data/site.js` pour
les textes et `design.config.js` pour l'apparence.

### Sections, dans l'ordre

| Composant | Rôle |
|---|---|
| `Topbar` | téléphone, courriel, délai de devis |
| `Header` | nav collante, section active, bascule clair/sombre, Devis gratuit |
| `Hero` | accroche, photo, carte de positions de recherche |
| `Partners` | bandeau défilant de certifications — masqué tant que vide |
| `Why` | quatre arguments différenciants |
| `ServiceTabs` | six services en onglets, pilotables au clavier et adressables |
| `Stats` | bandeau de chiffres animés — masqué tant que vide |
| `Process` | la méthode, unique : six étapes, dont les variantes IA |
| `Ia` | offre IA : six prestations, la promesse d'audit, quatre engagements |
| `Work` | réalisations — masqué tant que vide |
| `Testimonials` | avis clients — masqué tant que vide |
| `Team` | l'agence, mosaïque de locaux, fiche de contact |
| `Articles` | ressources — masqué tant que vide |
| `Faq` | douze questions en accordéon |
| `CallToAction` | rappel téléphone + devis |
| `Contact` | coordonnées et formulaire |
| `Legal` | mentions légales, confidentialité, conditions (repliées) |
| `Footer` | prestations, offre IA, plan du site, contact, secteurs |
| `SelecteurDesign` | **développement uniquement** : bascule entre les cinq designs |

L'ordre réel est dans `src/App.jsx`. Cinq sections disparaissent du site
construit tant que leurs données sont vides — voir « Contenus de preuve »
plus bas.

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

## Cinq designs, un seul projet

Le site existe en **cinq habillages complets**. Contenu, composants et
comportement sont identiques : seules changent la feuille de styles et les
polices.

| Clé | Design | Direction |
|---|---|---|
| `commercial` | Commercial | bleu et orange sur fond clair, cartes arrondies |
| `pilotage` | Poste de pilotage | HUD aérospatial, cyan de données, angles coupés |
| `neon` | Néon | enseigne de nuit, magenta et cyan, contours allumés |
| `holographique` | Holographique | verre dépoli, irisation violet-cyan-rose |
| `terminal` | Terminal phosphore | écran cathodique, monospace partout |

Chacun a ses **deux thèmes**, clair et sombre.

### Changer de design — deux méthodes

**Aucune des deux ne passe par une commande à taper dans le terminal.**

#### Méthode 1 — le sélecteur, pour comparer

```bash
npm run dev
```

Un panneau apparaît **en bas à gauche de la page** : `● Design : Commercial`.
Cliquez dessus, choisissez, la page se recharge. Rien à éditer, et c'est la
façon la plus rapide d'essayer les cinq.

Le choix est retenu dans votre navigateur. Il **ne décide jamais** de
l'apparence du site pour les visiteurs, et le panneau n'existe pas dans le
site construit.

#### Méthode 2 — le fichier, pour le site publié

Ouvrez **`design.config.js`** à la racine du projet et changez le mot de la
dernière ligne :

```js
export default "terminal";
```

Puis `npm run build`. C'est ce design-là qui part, et lui seul.

> **Cette ligne s'écrit dans le fichier, jamais dans le terminal.**
>
> C'est du JavaScript. Si vous la tapez dans PowerShell, vous obtiendrez
> `Le terme «export» n'est pas reconnu…`, et c'est normal : PowerShell ne lit
> pas de JavaScript.
>
> Le mot-clé `export` de JavaScript n'a rien à voir avec la commande `export`
> de bash, qui sert à déclarer une variable d'environnement. Ce projet ne lit
> aucune variable d'environnement pour choisir le design — tout passe par
> `design.config.js`.

Les cinq valeurs acceptées, en minuscules et sans accent :

| Valeur | Design |
|---|---|
| `"commercial"` | Commercial |
| `"pilotage"` | Poste de pilotage |
| `"neon"` | Néon — pas `"néon"` |
| `"holographique"` | Holographique |
| `"terminal"` | Terminal phosphore |

Une valeur inconnue **fait échouer la construction** avec un message de Vite
disant qu'il ne trouve pas la feuille. C'est voulu : mieux vaut un build qui
refuse de passer qu'un site publié avec un design par défaut silencieux.

`design.config.js` est la seule source de vérité : `vite.config.js` la lit
pour savoir quelle feuille inclure, et l'application la lit pour le reste.

### Changer de thème clair ou sombre

Rien à configurer : **le bouton rond dans l'en-tête**, à gauche de
« Devis gratuit ». Chacun des cinq designs a ses deux versions.

Par défaut le site suit le réglage du système d'exploitation du visiteur ;
dès qu'il clique, son choix est retenu dans son navigateur.

Pour **imposer** un thème à tout le monde, c'est dans
`src/hooks/useTheme.js` : la valeur initiale renvoyée par `lire()` est `null`
(suivre le système), remplacez-la par `"dark"` ou `"light"`.

### Ce qui part en production

**Un seul design.** Vérifié sur le bundle : les quatre autres n'y laissent
aucune trace, ni feuille, ni nom, ni adresse de police.

La feuille retenue est importée **statiquement**, donc Vite pose un
`<link rel="stylesheet">` dans l'en-tête. Polices, couleur de barre système et
favicon y sont écrits aussi, à la construction, par un petit greffon de
`vite.config.js`. Rien de visuel n'attend l'exécution du script — c'était le
défaut de la première version, où le CSS et les polices étaient injectés en
JavaScript.

### Le contrat de jetons

Les composants ne connaissent **aucune couleur de design**. Ils ne citent que
cinq jetons sémantiques, que chaque feuille doit déclarer à la fin, dans son
bloc « contrat partagé » :

| Jeton | Rôle |
|---|---|
| `--c-accent` | couleur d'appui, liens et données |
| `--c-action` | réservée aux actions |
| `--c-ok` | résultat positif, validation |
| `--c-faible` | texte secondaire |
| `--f-titre` | famille des titres |

Les variables CSS se résolvant au moment de l'usage, un seul bloc d'alias par
design suffit : il suit automatiquement le thème clair ou sombre actif.

### Ajouter un design

1. Déposez une feuille dans `src/styles/designs/`.
2. Terminez-la par le bloc « contrat partagé » (copiez celui d'un design
   existant).
3. Ajoutez sa fiche dans `src/designs.meta.js` — nom, résumé, polices,
   couleurs de barre, couleurs du favicon.
4. Ajoutez son chargeur dans `src/designs.js`.

Aucune ligne de JSX à toucher.

### Une réserve

Les cinq feuilles sont **autonomes**, pas factorisées : elles répètent chacune
la grille, les points de rupture et la structure des sections. C'est voulu —
ce sont cinq systèmes visuels réellement différents, et une base commune les
aurait tous tirés vers le compromis. Le prix : une correction de mise en page
structurelle doit être reportée dans les cinq fichiers.

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

Par ordre d'importance :

1. **Renseigner `studio` dans `src/data/site.js`** — nom, téléphone, courriel,
   adresse, NEQ, taxes, responsable de la protection des renseignements
   personnels. Les valeurs actuelles sont des gabarits, et le numéro de
   téléphone est volontairement faux (plage 555-01XX, réservée à la fiction).
2. **Faire relire les trois documents légaux par un juriste.** La Loi 25 n'est
   pas une formalité décorative.
3. **Brancher le formulaire** (voir « Formulaire »), et protéger le point
   d'entrée contre les envois automatisés.
4. **Vérifier la marque** auprès de l'Office de la propriété intellectuelle du
   Canada, classes 42 et 35, avant d'utiliser le nom.
5. **Optimiser les images** (voir « Poids des images ») et vérifier leur
   licence d'usage commercial.
6. **Choisir le design définitif** dans `design.config.js`.
7. Remplir les jeux de données de preuve au fur et à mesure que vous avez de
   quoi les remplir honnêtement.
8. Fournir une image Open Graph (`og:image`) pour l'aperçu des partages.
