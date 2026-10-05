import { studio } from "../data/site.js";
import { Ico } from "./Icons.jsx";

/* Pas de sélecteur de langue tant que le site n'existe qu'en français : un
   bouton qui ne traduit rien décrédibilise l'offre bilingue qu'on vend. Le
   jour où la version anglaise existe, il reprend sa place ici. */
export default function Topbar() {
  return (
    <div className="topbar">
      <div className="wrap topbar__in">
        <div className="topbar__g">
          <a href={`tel:${studio.telBrut}`} className="topbar__tel">
            <Ico nom="telephone" taille={15} />
            {studio.tel}
          </a>
          <a href={`mailto:${studio.email}`}>
            <Ico nom="courriel" taille={15} />
            {studio.email}
          </a>
        </div>

        <div className="topbar__d">
          <span className="topbar__note">
            {studio.delai} · {studio.ville}
          </span>
        </div>
      </div>
    </div>
  );
}
