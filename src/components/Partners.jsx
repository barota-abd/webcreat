import { badges } from "../data/site.js";
import { Ico } from "./Icons.jsx";

export default function Partners() {
  // Rien à afficher tant qu'aucune certification réelle n'est saisie.
  if (badges.length === 0) return null;

  // La liste est doublée pour que la translation de 50 % reboucle sans saut.
  const boucle = [...badges, ...badges];

  return (
    <div className="bandeau">
      <p className="bandeau__t">Certifications et partenaires techniques</p>
      <div className="piste">
        {boucle.map((b, i) => (
          <span
            className="badge"
            key={`${b.nom}-${i}`}
            style={{ "--t": b.t }}
            aria-hidden={i >= badges.length}
          >
            <Ico nom="coche" taille={15} trait={2.4} />
            {b.nom}
          </span>
        ))}
      </div>
    </div>
  );
}
