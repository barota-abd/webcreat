/* ==========================================================================
   Registre des designs

   Le site existe en cinq habillages complets. Le contenu, les composants et
   le comportement sont identiques : seules changent la feuille de styles et
   les polices.

   POUR CHANGER DE DESIGN : modifiez design.config.js à la racine du projet,
   puis relancez. Un seul design part dans le site construit — les feuilles
   des quatre autres n'entrent jamais dans le bundle.

   POUR EN AJOUTER UN :
   1. déposez une feuille dans src/styles/designs/ ;
   2. terminez-la par le bloc « contrat partagé » (voir n'importe quel design
      existant) : les composants ne citent que --c-accent, --c-action, --c-ok,
      --c-faible et --f-titre, donc tout design qui fournit ces cinq jetons
      fonctionne sans toucher à une ligne de JSX ;
   3. ajoutez sa fiche dans src/designs.meta.js ;
   4. ajoutez son chargeur ci-dessous.
   ========================================================================== */

import DESIGN_CONFIGURE from "../design.config.js";
import { META } from "./designs.meta.js";

export { META };
export const DESIGN_ACTIF = DESIGN_CONFIGURE;

/* Les imports dynamiques ne servent qu'au sélecteur de développement. En
   production, `import.meta.env.DEV` vaut false : l'expression se réduit à
   null et les quatre feuilles non retenues disparaissent du bundle. */
export const CHARGEURS = {
  commercial: import.meta.env.DEV
    ? () => import("./styles/designs/commercial.css")
    : null,
  pilotage: import.meta.env.DEV
    ? () => import("./styles/designs/pilotage.css")
    : null,
  neon: import.meta.env.DEV ? () => import("./styles/designs/neon.css") : null,
  holographique: import.meta.env.DEV
    ? () => import("./styles/designs/holographique.css")
    : null,
  terminal: import.meta.env.DEV
    ? () => import("./styles/designs/terminal.css")
    : null,
};

const CLE = "tos-design";

/**
 * En développement, un design choisi depuis le sélecteur l'emporte sur la
 * configuration, pour pouvoir comparer sans rouvrir le code. En production,
 * seule la configuration compte : le choix stocké dans un navigateur ne doit
 * pas décider de l'apparence du site pour qui que ce soit.
 */
export function designRetenu() {
  if (import.meta.env.DEV) {
    try {
      const choisi = localStorage.getItem(CLE);
      if (choisi && META[choisi]) return choisi;
    } catch {
      /* stockage indisponible : on retombe sur la configuration */
    }
  }
  /* Pas de garde ici : une clé inconnue dans design.config.js fait déjà
     échouer la construction, puisque l'alias de Vite pointerait sur une
     feuille inexistante. Le chemin de production n'a donc aucune raison de
     connaître les autres designs. */
  return DESIGN_CONFIGURE;
}

export function retenirDesign(cle) {
  try {
    if (cle) localStorage.setItem(CLE, cle);
    else localStorage.removeItem(CLE);
  } catch {
    /* sans stockage, le choix ne survit pas au rechargement */
  }
}
