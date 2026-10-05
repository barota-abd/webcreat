import { medias } from "../data/medias.js";
import { avis } from "../data/site.js";
import Attente from "./Attente.jsx";
import { Etoiles } from "./Icons.jsx";
import Media from "./Media.jsx";
import SectionHead from "./SectionHead.jsx";

const gabarit = [
  { champ: "mot", exemple: "Ce que le client a écrit, sans retouche." },
  { champ: "qui", exemple: "Prénom Nom" },
  { champ: "ou", exemple: "Fonction, Société" },
  { champ: "ini", exemple: "Initiales, si pas de portrait" },
];

/* Échafaudage de développement : retiré du site construit. */
function SansContenu() {
  return (
    <section className="sect">
      <div className="wrap">
        <SectionHead
          etiquette="Avis clients"
          titre="Les retours de vos clients"
          texte="Le meilleur moment pour les recueillir : trois mois après la mise en ligne, quand il ne reste que les résultats."
        />
        <Attente
          icone="etoile"
          teinte="#f5a623"
          titre="Aucun témoignage publié pour l'instant"
          texte="N'affichez que des avis réellement reçus, et demandez à la personne citée son accord sur son nom et sa fonction avant de les publier."
          fichier="src/data/site.js"
          cle="avis"
          gabarit={gabarit}
        />
      </div>
    </section>
  );
}

export default function Testimonials() {
  if (avis.length === 0) {
    if (!import.meta.env.DEV) return null;
    return <SansContenu />;
  }

  return (
    <section className="sect">
      <div className="wrap">
        <div className="avis__tete">
          <SectionHead
            etiquette="Avis clients"
            titre="Ce qu'on nous dit trois mois après"
            texte="Recueilli une fois l'effet nouveauté passé, quand il ne reste que les résultats."
          />
        </div>

        <div className="avis-grille">
          {avis.map((a, i) => (
            <figure
              className="carte carte--colonne avis"
              key={a.qui}
              data-reveal
              style={{ "--d": `${i * 60}ms` }}
            >
              <Etoiles />
              <blockquote>« {a.mot} »</blockquote>
              <figcaption className="avis__qui">
                {medias.avis[a.ini] ? (
                  <Media
                    media={medias.avis[a.ini]}
                    rond
                    className="portrait"
                    repli={a.ini}
                  />
                ) : (
                  <span className="pastille-ini">{a.ini}</span>
                )}
                <span className="avis__id">
                  <b>{a.qui}</b>
                  <span>{a.ou}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
