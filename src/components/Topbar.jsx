import { studio } from "../data/site.js";
import { Ico } from "./Icons.jsx";

/* La prise de contact passe uniquement par le formulaire : ce bandeau ne
   porte donc ni téléphone ni adresse, seulement la promesse de délai et le
   chemin pour la réclamer.

   Pas de sélecteur de langue non plus tant que le site n'existe qu'en
   français : un bouton qui ne traduit rien décrédibiliserait l'offre bilingue
   qu'on vend. Le jour où la version anglaise existe, il reprend sa place. */
export default function Topbar() {
  return (
    <div className="topbar">
      <div className="wrap topbar__in">
        <div className="topbar__g">
          <span className="topbar__tel">
            <Ico nom="horloge" taille={15} />
            {studio.delai}
          </span>
        </div>

        <div className="topbar__d">
          <span className="topbar__note">{studio.ville}</span>
          <a href="#contact">
            <Ico nom="courriel" taille={15} />
            Demander un devis
          </a>
        </div>
      </div>
    </div>
  );
}
