/* En production, cet import est remplacé par la feuille du design configuré :
   Vite la place dans un <link> de l'en-tête, donc elle est téléchargée en
   parallèle du script et non après lui. En développement il pointe sur un
   fichier vide, et le sélecteur charge le design à chaud. */
import "#design";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CHARGEURS, designRetenu } from "./designs.js";
import { META, faviconSVG } from "./designs.meta.js";

// Marque la page comme animable : sans JS, le CSS laisse tout visible.
document.documentElement.classList.add("has-js");

const cle = designRetenu();
document.documentElement.dataset.design = cle;

/* En production, polices, couleur de barre et favicon sont déjà dans
   l'en-tête, écrits à la construction par vite.config.js. Ici, on ne les pose
   que pendant le développement, où le design change à chaud. */
if (import.meta.env.DEV) {
  const fiche = META[cle];

  const police = document.createElement("link");
  police.rel = "stylesheet";
  police.href = fiche.polices;
  document.head.appendChild(police);

  const icone = document.createElement("link");
  icone.rel = "icon";
  icone.type = "image/svg+xml";
  icone.href = faviconSVG(fiche.marque);
  document.head.appendChild(icone);
}

function demarrer() {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (import.meta.env.DEV) {
  // La feuille est chargée avant le premier rendu, sinon la page apparaîtrait
  // une fraction de seconde sans aucun style.
  CHARGEURS[cle]().then(demarrer);
} else {
  demarrer();
}
