export const studio = {
  nom: "Tech Orbit Solution",
  complet: "Tech Orbit Solution",
  baseline: "Agence web & applications",
  accroche: "Création de sites web, applications et référencement",
  email: "bonjour@tech-orbit-solution.com",
  /* Laissez vide tant que vous n'avez pas de ligne à publier : tous les
     boutons d'appel du site disparaissent alors d'eux-mêmes. Renseignez les
     deux champs pour les faire revenir — `tel` pour l'affichage, `telBrut`
     pour le lien, au format +1XXXXXXXXXX. */
  tel: "",
  telBrut: "",
  /* Vides : le site n'annonce aucune implantation. Comme pour le téléphone,
     tout ce qui en dépend disparaît de lui-même — la pastille du héros, la
     ligne du pied de page, la colonne « Nous joindre ». Renseignez-les pour
     les faire revenir. */
  ville: "",
  region: "",

  /* Identite legale. Toute ligne laissee vide disparait des mentions. */
  neq: "", // ex. « NEQ 1170123456 » — Registre des entreprises du Québec
  forme: "", // ex. « Société par actions constituée au Québec »
  adresse: "", // ex. « 123 rue de l'Exemple, Ville (Québec) A1B 2C3 »
  taxes: "", // ex. « TPS 123456789 RT0001 · TVQ 1234567890 TQ0001 »
  directeur: "", // responsable de la publication
  responsablePrp: "", // responsable de la protection des renseignements personnels (Loi 25)
  hebergeur: "", // ex. « Vercel Inc. »
  hebergeurAdresse: "",
  delai: "Devis chiffré sous 48 h ouvrables",
  depuis: 2012,

  /* Laissez vide un réseau que vous n'utilisez pas : l'icône n'apparaîtra
     pas. Un lien social qui ne mène nulle part coûte plus de crédibilité
     qu'une icône manquante. */
  reseaux: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
};

export const nav = [
  { id: "services", label: "Nos services" },
  { id: "ia", label: "Services IA" },
  { id: "methode", label: "Méthode" },
  { id: "realisations", label: "Réalisations" },
  { id: "equipe", label: "L'agence" },
  { id: "contact", label: "Contact" },
];

/* --------------------------------------------------- héros : carte de rang */

/* Illustration de la prestation de suivi de positions. Volontairement
   generique : aucune entreprise reelle n'y est nommee ni presentee comme
   cliente. */
export const rangs = [
  { n: 1, titre: "Votre entreprise", url: "votre-site.com", vous: true },
  { n: 2, titre: "Un concurrent direct", url: "concurrent-a.com" },
  { n: 3, titre: "Un autre concurrent", url: "concurrent-b.com" },
  { n: 4, titre: "Un annuaire professionnel", url: "annuaire-pro.com" },
];

/* Chiffres de preuve affiches sous l'accroche du heros.
   Vide : ne mettez ici que des chiffres verifiables (nombre reel de projets,
   note reelle d'une plateforme d'avis). La rangee disparait si le tableau
   reste vide.
   Forme : { v: "<votre note>", l: "<sur quoi elle porte>", etoiles: true } */
export const preuves = [];

/* ------------------------------------------------------- bandeau de badges */

/* Certifications et partenariats techniques.
   Vide : ce sont des marques deposees et des engagements verifiables.
   N'ajoutez que celles que vous detenez reellement, sinon le bandeau reste
   masque.
   Forme : { nom: "Google Partner", t: "#1a73e8" } */
export const badges = [];

/* ------------------------------------------------------------------ atouts */

export const atouts = [
  {
    icone: "cible",
    t: "#1540c9",
    titre: "Visible là où on vous cherche",
    texte:
      "Google, mais aussi les réponses générées par ChatGPT et Perplexity. Nous structurons vos pages pour les deux, parce que vos clients utilisent déjà les deux.",
  },
  {
    icone: "eclair",
    t: "#e65a12",
    titre: "Rapide, mesuré, prouvé",
    texte:
      "Chaque site part en ligne avec son relevé Lighthouse. Moins de 1,2 s d'affichage sur mobile 4G, sinon nous retravaillons avant la livraison.",
  },
  {
    icone: "cle",
    t: "#0d8a51",
    titre: "Tout vous appartient",
    texte:
      "Dépôt Git, fichiers Figma, accès d'hébergement et comptes publicitaires sont à votre nom. Vous pouvez partir demain sans rien nous demander.",
  },
  {
    icone: "humain",
    t: "#7c4dd4",
    titre: "Une seule équipe, ici",
    texte:
      "Zéro sous-traitance, aucune agence intermédiaire. La personne qui prend votre appel est celle qui travaille sur votre projet, du cadrage à la mise en ligne.",
  },
];

/* --------------------------------------------------- offres en onglets

   Quatre offres, pas neuf prestations. Un commerçant qui arrive ici doit
   comprendre en un regard ce qu'on peut faire pour lui ; neuf onglets le
   forçaient à lire une liste de métiers et à deviner lequel le concerne.

   Les prestations n'ont pas disparu : elles vivent à l'intérieur de l'offre
   qui les regroupe. Le suivi garde son onglet plutôt que d'être relégué en
   complément — c'est le seul revenu qui rentre quand aucun projet ne signe.
   --------------------------------------------------------------------- */

export const services = [
  {
    id: "web",
    icone: "ecran",
    t: "#1540c9",
    onglet: "Création web & visibilité",
    pour: "Pour attirer des clients et transformer les visites en demandes",
    titre: "Un site qui travaille pour vous, pas l'inverse",
    texte:
      "Créer le site ou reprendre celui qui existe, puis tout ce qui amène du monde dessus. Votre équipe garde la main sur les contenus après une heure de formation, sans toucher à une ligne de code.",
    prestations: [
      {
        nom: "Création de site web",
        points: [
          "Maquette validée avant le moindre développement",
          "Affichage net sur mobile, tablette et grand écran",
          "Back-office de rédaction simple, formation incluse",
          "Version bilingue français / anglais si besoin",
        ],
      },
      {
        nom: "Modernisation d'un site existant",
        points: [
          "Reprise de vos contenus, sans ressaisie",
          "Redirections en place : aucun acquis de référencement sacrifié",
          "Temps de chargement et accessibilité corrigés",
          "Composants obsolètes et failles connues mis à jour",
        ],
      },
      {
        nom: "Référencement",
        points: [
          "Audit technique et sémantique, chantier priorisé",
          "Recherche des requêtes qui convertissent",
          "Fiche d'établissement Google et avis clients",
          "Suivi de vos citations dans ChatGPT et Perplexity",
          "Rapport mensuel avec positions et trafic",
        ],
      },
      {
        nom: "Publicité en ligne",
        points: [
          "Google, Meta et LinkedIn pilotés au coût par demande",
          "Pages de destination dédiées, conversions vérifiées",
          "Budget média séparé de nos honoraires, toujours",
          "Tableau de bord partagé en continu",
        ],
      },
    ],
    cta: "Je veux un site web",
    lien: "#contact",
  },
  {
    id: "ia",
    icone: "etincelle",
    t: "#b8318a",
    onglet: "Automatisation & IA",
    pour: "Pour les entreprises qui perdent du temps sur ce qui se répète",
    titre: "Faire traiter par une machine ce qui se répète",
    texte:
      "Nous ne vendons pas de l'IA, nous vendons du temps rendu. On commence par chronométrer une tâche précise, jamais par choisir un outil, et on la met à l'épreuve sur un pilote avant d'engager quoi que ce soit.",
    prestations: [
      {
        nom: "Ce que nous automatisons",
        points: [
          "Tri et brouillons de réponse aux demandes entrantes",
          "Agent conversationnel sur vos propres contenus",
          "Extraction des factures et bons de livraison",
          "Assistant interne sur vos procédures",
          "Qualification des demandes et prise de rendez-vous",
        ],
      },
      {
        nom: "Comment nous procédons",
        points: [
          "Audit d'une tâche : ce qu'elle coûte réellement aujourd'hui",
          "Pilote mesuré avant tout engagement",
          "Validation humaine par défaut, sous-traitants documentés",
          "Décision automatisée signalée, comme l'exige la Loi 25",
        ],
      },
    ],
    cta: "Voir l'offre IA en détail",
    lien: "#ia",
  },
  {
    id: "apps",
    icone: "mobile",
    t: "#7c4dd4",
    onglet: "Applications & solutions",
    pour: "Pour les besoins qu'un site vitrine ne couvre pas",
    titre: "Quand le besoin dépasse le site",
    texte:
      "Applications métier, espaces clients, et la reprise de ce qui tourne depuis dix ans et que plus personne n'ose modifier.",
    prestations: [
      {
        nom: "Applications mobiles",
        points: [
          "iOS et Android avec un seul développement",
          "Mode hors-ligne et synchronisation",
          "Paiement intégré et abonnements",
          "Dépôt et suivi des validations App Store / Play",
        ],
      },
      {
        nom: "Audit d'application existante",
        points: [
          "Lecture du code, de l'architecture et des dépendances",
          "Points de rupture : ce qui cassera en premier, et quand",
          "Trois scénarios chiffrés — maintenir, moderniser, remplacer",
          "Rapport lisible par la direction, détail technique en annexe",
        ],
      },
      {
        nom: "Modernisation applicative",
        points: [
          "Migration par étapes : l'ancien et le nouveau cohabitent",
          "Reprise des données avec contrôle de cohérence",
          "Tests automatisés posés avant de toucher au code",
          "Retour arrière possible à chaque étape",
        ],
      },
    ],
    cta: "Parler de mon projet",
    lien: "#contact",
  },
  {
    id: "suivi",
    icone: "bouclier",
    t: "#0a7b8c",
    onglet: "Hébergement & suivi",
    pour: "Pour que ce qui est en ligne y reste",
    titre: "Un site qui reste en ligne et à jour",
    texte:
      "Hébergement géré, sauvegardes testées pour de vrai, mises à jour de sécurité et un interlocuteur joignable. Sans engagement de durée.",
    prestations: [
      {
        nom: "Ce qui est couvert",
        points: [
          "Hébergement géré, chez nous ou chez votre fournisseur",
          "Sauvegardes quotidiennes et restauration testée",
          "Mises à jour de sécurité suivies",
          "Surveillance de disponibilité 24/7",
          "2 h d'évolutions incluses chaque mois",
          "Réponse garantie en 4 h ouvrables",
        ],
      },
    ],
    cta: "Parler du suivi",
    lien: "#contact",
  },
];

export const servicesIA = [
  {
    id: "agent-client",
    court: "Agent conversationnel",
    icone: "dialogue",
    t: "#1540c9",
    titre: "Agent conversationnel sur vos contenus",
    texte:
      "Un assistant qui répond aux questions de vos clients à partir de vos fiches produit, votre documentation et vos conditions de vente — pas à partir de ce qu'il croit savoir.",
    fait: [
      "Cite la source de chaque réponse",
      "Dit « je ne sais pas » au lieu d'inventer",
      "Passe la main à une personne dès que ça sort du cadre",
      "Sur votre site, votre espace client ou WhatsApp",
    ],
    duree: "3 à 5 semaines",
  },
  {
    id: "demandes",
    court: "Tri des demandes entrantes",
    icone: "entonnoir",
    t: "#e65a12",
    titre: "Tri et rédaction des demandes entrantes",
    texte:
      "Chaque e-mail, formulaire ou message est classé, envoyé à la bonne personne et accompagné d'un brouillon de réponse déjà rédigé dans votre ton.",
    fait: [
      "Classement par type, urgence et destinataire",
      "Brouillon prêt à relire, jamais envoyé seul",
      "Détection des demandes sensibles",
      "Branché sur votre boîte mail existante",
    ],
    duree: "2 à 4 semaines",
  },
  {
    id: "documents",
    court: "Lecture de documents",
    icone: "document",
    t: "#0d8a51",
    titre: "Lecture automatique de vos documents",
    texte:
      "Factures fournisseurs, bons de livraison, devis signés : les informations sont extraites et déversées dans votre comptabilité ou votre ERP.",
    fait: [
      "Lecture des PDF, scans et photos",
      "Contrôle de cohérence avant enregistrement",
      "File de vérification pour les cas douteux",
      "Export vers votre outil, pas un tableur de plus",
    ],
    duree: "4 à 6 semaines",
  },
  {
    id: "assistant-interne",
    court: "Assistant interne",
    icone: "loupe",
    t: "#7c4dd4",
    titre: "Assistant interne sur vos procédures",
    texte:
      "Vos équipes interrogent en langage courant vos procédures, contrats, notices techniques et comptes rendus, au lieu de chercher dans douze dossiers partagés.",
    fait: [
      "Réponse renvoyant au document d'origine",
      "Respecte les droits d'accès de chacun",
      "Fonctionne sur vos fichiers existants",
      "Journal des questions pour repérer les manques",
    ],
    duree: "4 à 7 semaines",
  },
  {
    id: "rendez-vous",
    court: "Prise de rendez-vous",
    icone: "agenda",
    t: "#0a7b8c",
    titre: "Qualification et prise de rendez-vous",
    texte:
      "Les demandes entrantes sont qualifiées, complétées, puis converties en rendez-vous dans l'agenda de la bonne personne.",
    fait: [
      "Questions de qualification adaptées à votre métier",
      "Créneau posé directement dans l'agenda",
      "Réponse honnête aux demandes hors cible",
      "Fiche créée dans votre CRM",
    ],
    duree: "2 à 4 semaines",
  },
  {
    id: "contenus",
    court: "Contenus et traductions",
    icone: "globe",
    t: "#b8318a",
    titre: "Contenus et traductions en série",
    texte:
      "Fiches produit, descriptions, traductions : génération à partir de vos données structurées, dans votre vocabulaire, avec relecture avant publication.",
    fait: [
      "Part de votre catalogue, pas d'une page blanche",
      "Respecte votre glossaire et vos interdits",
      "Relecture humaine intégrée au circuit",
      "Publication par lots dans votre CMS",
    ],
    duree: "2 à 3 semaines",
  },
];

/* Engagements techniques de l'offre IA. Ce sont des regles de conception,
   verifiables dans le systeme livre. */
export const gardesIA = [
  {
    icone: "coche",
    t: "#0d8a51",
    titre: "Validation humaine par défaut",
    texte:
      "Rien ne part vers un client sans qu'une personne ait relu, tant que vous n'en décidez pas autrement. Le niveau d'autonomie est un réglage que vous tenez, pas un pari que vous prenez.",
  },
  {
    icone: "cadenas",
    t: "#1540c9",
    titre: "Vos documents ne servent à rien d'autre",
    texte:
      "Ils servent à répondre à vos questions, point. Aucune réutilisation pour entraîner un modèle public, et le contrat l'écrit noir sur blanc plutôt qu'une page marketing.",
  },
  {
    icone: "graphique",
    t: "#e65a12",
    titre: "Traçable et mesuré",
    texte:
      "Chaque réponse générée est journalisée avec sa source. Vous voyez ce qui a été automatisé, ce qui a été corrigé par vos équipes, et ce que ça représente en temps.",
  },
  {
    icone: "balance",
    t: "#7c4dd4",
    titre: "Conforme à la Loi 25",
    texte:
      "Registre des usages, information des personnes concernées dès qu'une décision est automatisée, et possibilité d'obtenir un interlocuteur humain qui la réexamine. La documentation est livrée avec le système.",
  },
];



/* ----------------------------------------------------------------- méthode */

export const etapes = [
  {
    n: "01",
    titre: "Appel de cadrage",
    texte:
      "Une heure en visioconférence pour comprendre ce que vous vendez, à qui, et ce qui vous bloque aujourd'hui. Nous repartons avec vos textes, vos photos et vos accès : c'est ce qui rend la suite possible en quelques jours. Pour un projet d'IA, cette étape devient un audit des tâches.",
    duree: "Avant de démarrer",
  },
  {
    n: "02",
    titre: "Devis ferme",
    texte:
      "Un prix, pas une fourchette, détaillé poste par poste. Il ne bouge plus ensuite, sauf si vous ajoutez du périmètre — et vous le validez avant.",
    duree: "Sous 48 h",
  },
  {
    n: "03",
    titre: "Design",
    texte:
      "Maquette de la page d'accueil, présentée en visioconférence et corrigée avec vous pendant l'appel plutôt qu'en allers-retours par courriel. Sur un projet d'IA, cette étape est remplacée par un pilote : une seule tâche, mise entre les mains de votre équipe et mesurée sur des dossiers réels.",
    duree: "Lundi et mardi",
  },
  {
    n: "04",
    titre: "Développement",
    texte:
      "Un lien de préproduction mis à jour en continu, que vous pouvez ouvrir à tout moment. Vous suivez la construction heure par heure au lieu d'attendre une livraison.",
    duree: "Mercredi et jeudi",
  },
  {
    n: "05",
    titre: "Mise en ligne",
    texte:
      "Recette sur appareils réels, formation de votre équipe, bascule du nom de domaine. Le site est en ligne. Puis 30 jours de garantie sur tout correctif lié à notre travail.",
    duree: "Vendredi",
  },
  {
    n: "06",
    titre: "Suivi",
    texte:
      "Rapport mensuel lisible en une page, évolutions au fil de l'eau, et un interlocuteur qui connaît votre dossier. Sans engagement de durée.",
    duree: "Ensuite, si vous voulez",
  },
];


/* ------------------------------------------------------------ réalisations */

/* ------------------------------------------------------------- chiffres ==
   Bandeau bleu de chiffres cles.
   Vide : la section entiere est masquee tant qu'aucun chiffre reel n'est
   saisi. Chaque valeur doit pouvoir etre justifiee si un client la demande.
   Forme : { v: "<le chiffre>", l: "<ce qu'il mesure>" }
   Une valeur entiere est animee de 0 jusqu'a elle a l'entree dans le cadre. */
export const chiffres = [];

/* Vos realisations.
   Le tableau est volontairement vide : la section affiche un etat d'attente
   tant que vous n'avez pas de projet reel a montrer. N'y mettez que des
   missions que vous avez reellement livrees, avec l'accord du client sur le
   nom et sur le chiffre annonce.

   Forme attendue :
   {
     nom: "Nom du client",
     t: "#1540c9",              // teinte de la vignette
     secteur: "Metier - Ville",
     type: "Site vitrine",
     resume: "Ce qui a ete fait, en une ou deux phrases.",
     gain: "+38 %",             // resultat mesure, verifiable
     unite: "de commandes en 6 mois",
   }

   Ajoutez ensuite l'image correspondante dans src/data/medias.js, sous
   `medias.projets`, avec le nom du client comme cle. Sans image, une vignette
   dessinee prend le relais. */
export const realisations = [];

/* ------------------------------------------------------------ témoignages */

/* Temoignages clients.
   Vide : n'y mettez que des avis reellement recus, avec l'accord de la
   personne citee sur son nom et sa fonction.
   Forme : { mot: "...", qui: "Prenom Nom", ou: "Fonction, Societe", ini: "PN" }
   Ajoutez le portrait sous `medias.avis` dans src/data/medias.js, avec les
   memes initiales comme cle ; sans portrait, une pastille d'initiales
   s'affiche. */
export const avis = [];

/* ------------------------------------------------------------------ équipe */

/* Engagements de l'agence. Ce sont des promesses que vous tenez, pas des
   chiffres de performance : relisez-les et gardez celles qui sont vraies. */
export const equipeArgs = [
  "Un interlocuteur unique, du premier appel à la mise en ligne.",
  "Réponse sous 4 h ouvrables, par téléphone ou par écrit.",
  "Nous disons non quand une idée ne sert pas votre projet.",
  "Formation de votre équipe comprise : vous êtes autonome à la livraison.",
];

/* Personne mise en avant pour l'appel direct.
   Laissez `nom` vide tant que ce n'est pas renseigne : la fiche bascule alors
   sur un bloc de contact neutre, sans citer quelqu'un qui n'existe pas. */
export const direction = {
  nom: "",
  role: "",
  ini: "",
  mot: "",
};

/* --------------------------------------------------------------- articles */

/* Ressources publiees.
   Vide : chaque entree doit correspondre a un article reellement redige et
   accessible.
   Forme : { cat: "Referencement", date: "18 septembre 2026",
             titre: "...", texte: "...", duree: "7 min", lien: "/blog/..." } */
export const articles = [];

/* -------------------------------------------------------------------- faq */

export const faq = [
  {
    q: "Quels sont vos tarifs ?",
    a: "Nous ne publions pas de grille de prix, parce que deux sites de cinq pages peuvent demander un travail du simple au triple selon les contenus à produire, les connexions à vos outils et le niveau de design attendu. Une fourchette affichée serait fausse dans un sens ou dans l'autre. En revanche, après l'appel de cadrage, vous recevez sous 48 h un devis ferme et détaillé poste par poste — et ce prix ne bouge plus ensuite, sauf si vous ajoutez du périmètre, ce que vous validez avant.",
  },
  {
    q: "Une semaine pour un site, c'est sérieux ?",
    a: "Oui, et c'est un engagement, pas un argument. Le cadrage et le devis se font avant. Ensuite nous bloquons cinq jours pour vous, et rien d'autre : maquette validée en direct lundi et mardi, construction mercredi et jeudi, mise en ligne vendredi. Ce qui rend ce rythme possible, c'est que nous repartons du cadrage avec vos textes, vos photos et vos accès. Si ces éléments manquent, le compteur ne démarre pas — nous préférons décaler d'une semaine que livrer un site rempli de faux texte. Les projets plus lourds — boutique, application, reprise d'un applicatif existant — gardent leurs délais propres, que nous annonçons au cadrage une fois le périmètre arrêté.",
  },
  {
    q: "Qui est propriétaire du site, du code et des comptes publicitaires ?",
    a: "Vous. Le dépôt Git, les fichiers Figma, les accès d'hébergement et les comptes Google Ads ou Meta sont à votre nom dès le départ. Si vous changez de prestataire, vous n'avez rien à nous demander.",
  },
  {
    q: "Garantissez-vous la première place sur Google ?",
    a: "Non, et méfiez-vous de ceux qui la garantissent : personne ne contrôle l'algorithme. Nous nous engageons sur le travail réalisé et sur un rapport mensuel honnête. En pratique, la plupart de nos clients atteignent la première page sur leurs requêtes locales en trois à six mois.",
  },
  {
    q: "Travaillez-vous avec WordPress ?",
    a: "Nous reprenons et maintenons des sites WordPress existants. Pour un nouveau projet, nous partons plutôt sur React avec un CMS headless : même confort de rédaction, pages beaucoup plus rapides, et beaucoup moins de failles à surveiller.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "30 % au démarrage, 40 % à l'approbation des maquettes, 30 % à la mise en ligne. Facturation en dollars canadiens, taxes en sus, payable par virement ou par chèque. Les services mensuels sont sans engagement de durée, résiliables avec 30 jours de préavis.",
  },
  {
    q: "L'IA risque-t-elle de raconter n'importe quoi à mes clients ?",
    a: "C'est le risque principal, et il se traite à la conception. Nos agents répondent uniquement à partir de vos documents, citent la source de chaque réponse, et sont réglés pour dire « je ne sais pas » plutôt que de combler un trou. Tout ce qui sort du périmètre prévu part vers une personne de votre équipe. Et par défaut, rien n'est envoyé à un client sans relecture — c'est vous qui décidez ensuite d'élargir l'autonomie, tâche par tâche.",
  },
  {
    q: "Mes documents vont-ils servir à entraîner un modèle ?",
    a: "Non. La réutilisation des données pour l'entraînement est désactivée contractuellement chez chacun de nos fournisseurs. Vos documents servent à répondre à vos questions, point. Nous vous remettons la liste des sous-traitants et l'inventaire des renseignements traités, comme l'exige la Loi 25, et nous l'écrivons dans le contrat plutôt que dans une page marketing.",
  },
  {
    q: "Par où commencer si je n'ai jamais rien automatisé ?",
    a: "Par l'audit des tâches, pas par un outil. Nous passons une à deux semaines à chronométrer ce qui se répète chez vous, puis nous vous rendons une liste classée par gain estimé et par difficulté — en signalant ce qu'il vaut mieux laisser à des humains. L'audit est facturé à part et se déduit du projet s'il y en a un. S'il conclut qu'aucune tâche ne mérite d'être automatisée chez vous, nous vous le disons et nous nous arrêtons là.",
  },
  {
    q: "Où sont hébergées les données ?",
    a: "Là où vous le décidez. Pour un site vitrine qui ne conserve rien d'autre que les messages de son formulaire, l'hébergeur se choisit sur la performance et le prix. Dès qu'un projet traite des renseignements personnels, nous documentons avec vous ce qui est conservé, où et par qui, et nous réalisons l'évaluation des facteurs relatifs à la vie privée exigée par la Loi 25 avant toute communication hors Québec.",
  },
  {
    q: "Mon site doit-il aussi exister en anglais ?",
    a: "Si vous servez une clientèle anglophone, oui — et la Charte de la langue française encadre la manière de le faire : la version française doit être disponible et au moins équivalente à l'anglaise, en contenu comme en accessibilité. Nous livrons les deux versions avec un sélecteur de langue, une structure d'adresses distincte pour que chaque version soit indexée correctement, et une terminologie française vérifiée. Ce n'est pas une traduction automatique posée par-dessus le site existant.",
  },
  {
    q: "Où êtes-vous installés ?",
    a: "Nous travaillons à distance, partout au Québec. Le cadrage se fait en visioconférence, les échanges par écrit, et vous gardez le même interlocuteur du premier appel à la mise en ligne. Cela nous évite des frais que vous paieriez sans rien y gagner.",
  },
];

/* ============================================================== mentions ==
   Documents destines a une entreprise etablie au Quebec. Ils s'appuient sur
   la Loi 25 (protection des renseignements personnels dans le secteur prive),
   la Loi sur la protection du consommateur et le droit civil quebecois.

   Les valeurs propres a votre entreprise se renseignent dans `studio`
   ci-dessus ; une ligne laissee vide ne s'affiche pas.

   FAITES RELIRE CES TEXTES par un juriste avant la mise en ligne. La Loi 25
   impose notamment de designer un responsable de la protection des
   renseignements personnels et de publier cette politique : ce ne sont pas
   des formalites decoratives.
   ======================================================================== */

export const legal = [
  {
    id: "mentions-legales",
    titre: "Informations légales",
    blocs: [
      {
        t: "Entreprise",
        lignes: [studio.complet, studio.forme, studio.adresse, studio.neq, studio.taxes],
      },
      { t: "Responsable de la publication", lignes: [studio.directeur] },
      { t: "Nous joindre", lignes: [studio.email, studio.tel] },
      {
        t: "Hébergement du site",
        lignes: [studio.hebergeur, studio.hebergeurAdresse],
      },
      {
        t: "Propriété intellectuelle",
        lignes: [
          "Les contenus de ce site — textes, images, code et identité visuelle — sont protégés par la Loi sur le droit d'auteur. Toute reproduction sans autorisation écrite est interdite.",
          "Les travaux livrés à nos clients leur sont cédés en pleine propriété à la livraison, selon les conditions de la soumission acceptée.",
        ],
      },
    ],
  },
  {
    id: "confidentialite",
    titre: "Politique de confidentialité",
    blocs: [
      {
        t: "Responsable de la protection des renseignements personnels",
        lignes: [studio.responsablePrp, studio.email, studio.tel],
      },
      {
        t: "Renseignements recueillis",
        lignes: [
          "Uniquement ceux que vous inscrivez dans le formulaire de contact : nom, adresse courriel, téléphone, entreprise, nature du besoin, échéance et description du projet.",
          "Aucun profilage, aucun achat de listes, aucune collecte à votre insu.",
        ],
      },
      {
        t: "Fins et consentement",
        lignes: [
          "Ces renseignements servent exclusivement à répondre à votre demande et, s'il y a lieu, à préparer une soumission. Vous y consentez en envoyant le formulaire, et vous pouvez retirer ce consentement en tout temps en nous écrivant.",
        ],
      },
      {
        t: "Communication à des tiers",
        lignes: [
          "Vos renseignements ne sont ni vendus, ni loués, ni échangés. Ils ne sont communiqués qu'aux fournisseurs strictement nécessaires à l'exploitation de notre site, de notre messagerie, de notre mesure d'audience et de notre assistant automatisé, liés par contrat et tenus à la même confidentialité.",
          "Avant toute communication de renseignements personnels à l'extérieur du Québec, nous procédons à l'évaluation des facteurs relatifs à la vie privée prévue par la Loi 25.",
        ],
      },
      {
        t: "Conservation et destruction",
        lignes: [
          "Trois ans après le dernier contact pour une demande restée sans suite, puis destruction. Pour un client, la durée prévue par nos obligations comptables et fiscales.",
        ],
      },
      {
        t: "Vos droits",
        lignes: [
          "Vous pouvez demander l'accès à vos renseignements, leur rectification, le retrait de votre consentement, la cessation de leur diffusion, ainsi que leur communication dans un format technologique structuré et couramment utilisé. Écrivez au responsable désigné ci-dessus : nous répondons dans les 30 jours.",
          "Si la réponse ne vous satisfait pas, vous pouvez porter plainte à la Commission d'accès à l'information du Québec.",
        ],
      },
      {
        t: "Incident de confidentialité",
        lignes: [
          "Nous tenons un registre des incidents de confidentialité. En cas d'incident présentant un risque de préjudice sérieux, nous en avisons sans délai les personnes concernées ainsi que la Commission d'accès à l'information.",
        ],
      },
      {
        t: "Assistant automatisé",
        lignes: [
          "Le site propose un assistant qui vous aide à décrire votre projet. Votre adresse courriel vous est demandée avant la conversation : elle sert uniquement à vous répondre, et n'est ni revendue ni versée à une liste de diffusion. Ce que vous écrivez ensuite est transmis à Anthropic, notre fournisseur de modèle de langage, pour produire la réponse — et à personne d'autre.",
          "N'y inscrivez pas de renseignement sensible : décrivez votre projet, pas votre vie privée. La conversation ne sert ni à entraîner un modèle, ni à vous profiler.",
          "À la fin de la conversation, l'échange nous est transmis sous forme d'analyse écrite : ce que nous avons compris de votre projet, et ce que nous vous proposerions. Le texte de la conversation lui-même ne nous est pas transmis et n'est conservé nulle part. La fenêtre vous informe de cette transmission dès son ouverture, avant que vous n'écriviez quoi que ce soit. L'analyse et votre adresse sont conservées comme toute demande entrante : trois ans après le dernier contact. Vous pouvez en demander la suppression à tout moment par le formulaire de contact.",
          "Si vous laissez votre adresse courriel, vous recevez vous aussi un résumé de votre projet. Vous n'êtes jamais obligé de la donner — l'assistant ne l'exige pas et n'insiste pas.",
          "Ce traitement implique une communication de renseignements à l'extérieur du Québec. Nous avons réalisé l'évaluation des facteurs relatifs à la vie privée prévue par la Loi 25, et vous pouvez en demander les conclusions.",
          "Vous pouvez évidemment nous écrire par le formulaire sans jamais utiliser l'assistant.",
        ],
      },
      {
        t: "Témoins et mesure d'audience",
        lignes: [
          "Ce site ne dépose aucun témoin publicitaire et ne vous suit pas d'un site à l'autre.",
          "Nous mesurons la fréquentation avec Vercel Analytics, qui compte les pages vues sans déposer de témoin, sans identifiant persistant et sans profilage. Les données sont agrégées : elles ne permettent pas de vous identifier, et nous ne cherchons pas à le faire.",
          "Les préférences d'affichage que vous choisissez, comme le thème clair ou sombre, restent dans votre navigateur et ne nous sont jamais transmises.",
        ],
      },
    ],
  },
  {
    id: "conditions",
    titre: "Conditions générales",
    blocs: [
      {
        t: "Objet",
        lignes: [
          "Les présentes conditions encadrent les services de conception, de développement, de référencement et d'accompagnement rendus par l'agence. Elles complètent la soumission acceptée, qui prévaut en cas de divergence.",
        ],
      },
      {
        t: "Soumission et commande",
        lignes: [
          "Toute soumission est valable 30 jours. Le mandat est ferme à la réception de la soumission acceptée et du dépôt. Toute demande sortant du mandat décrit fait l'objet d'un avenant chiffré, soumis à votre approbation avant exécution.",
        ],
      },
      {
        t: "Paiement",
        lignes: [
          "30 % au démarrage, 40 % à l'approbation des maquettes, 30 % à la mise en ligne. Les montants sont en dollars canadiens, taxes en sus. Les factures sont payables à 30 jours ; tout solde en souffrance porte intérêt au taux indiqué sur la facture.",
        ],
      },
      {
        t: "Délais et collaboration",
        lignes: [
          "Les délais annoncés supposent que vous nous fournissiez les contenus et les accès nécessaires aux moments convenus lors du cadrage. Un retard de votre côté décale l'échéancier d'autant.",
        ],
      },
      {
        t: "Propriété des livrables",
        lignes: [
          "À la livraison et après paiement complet, le code source, les fichiers de conception et les accès d'hébergement vous sont cédés en pleine propriété. Les composants tiers demeurent soumis à leurs licences respectives.",
        ],
      },
      {
        t: "Garantie",
        lignes: [
          "Tout correctif visant un défaut imputable à notre travail est pris en charge pendant 30 jours suivant la mise en ligne. Sont exclues les évolutions fonctionnelles et les anomalies résultant d'une intervention extérieure.",
        ],
      },
      {
        t: "Lois applicables",
        lignes: [
          "Les présentes sont régies par les lois en vigueur au Québec. À défaut d'entente à l'amiable, tout litige est soumis aux tribunaux compétents du district judiciaire où l'agence a son siège.",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------- formulaire */

export const echeances = [
  "Dès que possible",
  "Dans le mois",
  "Ce trimestre",
  "Dans les six mois",
  "Pas encore défini",
];

export const besoins = [
  "Site vitrine",
  "Site bilingue français / anglais",
  "Boutique en ligne",
  "Modernisation d'un site existant",
  "Application mobile",
  "Plateforme / espace client",
  "Audit d'une application existante",
  "Modernisation applicative / d'architecture",
  "Référencement SEO",
  "Google & Meta Ads",
  "Agent conversationnel (chatbot)",
  "Automatisation de tâches par IA",
  "Lecture automatique de documents",
  "Hébergement & suivi",
];

/* Le site n'affiche aucun tarif : il dépend trop du périmètre pour qu'une
   grille publique dise quoi que ce soit d'honnête. Mais arriver au premier
   appel sans la moindre idée de l'enveloppe fait perdre du temps aux deux
   parties. D'où cette fourchette — elle qualifie sans engager personne, et
   « je ne sais pas encore » est une réponse recevable, pas un échec. */
export const budgets = [
  "Moins de 2 000 $",
  "2 000 $ à 5 000 $",
  "5 000 $ à 15 000 $",
  "Plus de 15 000 $",
  "Je ne sais pas encore",
];

/* --------------------------------------------------------------- pied */

/* Vos implantations.
   Vide : n'annoncez que des bureaux ou vous recevez reellement. Le bloc de
   contact du pied de page reste affiche dans tous les cas.
   Forme : { ville: "Ville - siege", adr: "...", tel: "..." } */
export const bureaux = [];

export const secteurs = [
  "Artisans", "Bâtiment", "Restauration", "Santé", "Immobilier", "Avocats",
  "Notaires", "Industrie", "Commerce", "Hôtellerie", "Associations",
  "Collectivités", "Formation", "Transport", "Agriculture", "Sport",
  "Beauté", "Automobile",
];
