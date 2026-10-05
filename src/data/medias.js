/* ==========================================================================
   Toutes les images du site, en un seul endroit.

   Les fichiers vivent dans public/images/ et sont servis par votre propre
   hébergement : aucun appel à un service tiers, donc rien à déclarer côté
   vie privée et rien qui casse si un service externe tombe.

   Pour remplacer une image : déposez le nouveau fichier dans public/images/,
   changez `src`, puis corrigez `l` / `h` (dimensions réelles, en pixels) et
   le texte alternatif. Si un fichier manque, <Media> affiche une vignette
   dessinée à la place et la mise en page tient quand même.

   ATTENTION aux photos où l'on reconnaît des personnes : ce sont des images
   d'illustration, pas votre équipe. Les textes alternatifs ci-dessous
   décrivent donc une scène de travail sans affirmer qu'il s'agit de vos
   salariés ni de vos locaux. Si vous gardez ces visuels, ne les légendez pas
   « notre équipe » ou « nos bureaux ».
   ========================================================================== */

const EQUIPE_ATELIER = {
  src: "/images/equipe-atelier.jpg",
  alt: "Cinq personnes réunies devant une paroi vitrée couverte de pense-bêtes lors d'un atelier de travail",
  l: 1920,
  h: 1072,
};

const BUREAUX_PLATEAU = {
  src: "/images/bureaux-plateau.jpg",
  alt: "Trois personnes travaillant sur ordinateur portable dans un espace lumineux",
  l: 1440,
  h: 1920,
};

const ATELIER_CADRAGE = {
  src: "/images/atelier-cadrage.jpg",
  alt: "Pense-bêtes annotés et feuilles étalés sur une table de réunion",
  l: 1920,
  h: 1440,
};

const BUREAU_MOBILE = {
  src: "/images/bureau-mobile.jpg",
  alt: "Téléphone, carnet ouvert et tasse de café posés sur un bureau blanc",
  l: 1920,
  h: 1280,
};

const POSTE_DEVELOPPEMENT = {
  src: "/images/poste-developpement.jpg",
  alt: "Ordinateur portable, carnet et ouvrage de développement web sur un plan de travail en bois",
  l: 1920,
  h: 1152,
};

const IA_VISUEL = {
  src: "/images/ia-intelligence-artificielle.jpg",
  alt: "Main robotisée dont l'index effleure un réseau de données lumineux sur fond bleu nuit",
  l: 1920,
  h: 1280,
};

const ECRAN_CODE = {
  src: "/images/ecran-code.jpg",
  alt: "Feuille de style CSS affichée dans un éditeur de code sur un ordinateur portable",
  l: 1920,
  h: 1280,
};

export const medias = {
  /* ------------------------------------------------------------------ héros */
  hero: EQUIPE_ATELIER,

  /* --------------------------------------------------------------- services */
  /* Un seul onglet est visible à la fois : une même photo peut donc servir
     deux services éloignés sans que la répétition se remarque. */
  services: {
    sites: POSTE_DEVELOPPEMENT,
    apps: BUREAU_MOBILE,
    seo: ECRAN_CODE,
    ads: ATELIER_CADRAGE,
    ia: BUREAUX_PLATEAU,
    suivi: ECRAN_CODE,
  },

  /* --------------------------------------------------------------- offre IA */
  /* Visuel de la section « Intelligence artificielle », à côté de la méthode. */
  ia: IA_VISUEL,

  /* ----------------------------------------------------------- réalisations */
  /* Une entrée par réalisation, la clé étant le `nom` défini dans site.js.
     Vide tant qu'aucun projet réel n'est publié ; si une entrée manque, la
     carte affiche une vignette dessinée au lieu d'une image. */
  projets: {},

  /* ------------------------------------------------------------ témoignages */
  /* Une entrée par témoignage, la clé étant le champ `ini` défini dans
     site.js. Sans entrée, une pastille d'initiales remplace le portrait. */
  avis: {},

  /* ----------------------------------------------------------------- agence */
  /* Mosaïque de la section « L'agence ». La première image occupe toute la
     largeur, les deux suivantes se partagent la ligne du dessous. */
  bureaux: [BUREAUX_PLATEAU, ATELIER_CADRAGE, BUREAU_MOBILE],

  /* Portrait de la personne mise en avant dans la section Agence. */
  direction: null,

  /* --------------------------------------------------------------- articles */
  /* Une entrée par article publié, dans le même ordre que `articles`
     dans site.js. */
  articles: [],
};

/** Chemin de l'image, ou null si l'emplacement n'est pas renseigné. */
export function urlMedia(m) {
  return m?.src || null;
}
