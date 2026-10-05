import { medias } from "../data/medias.js";
import { realisations } from "../data/site.js";
import Attente from "./Attente.jsx";
import { Fleche } from "./Icons.jsx";
import Media from "./Media.jsx";
import SectionHead from "./SectionHead.jsx";

const gabarit = [
  { champ: "secteur", exemple: "Métier — Ville" },
  { champ: "nom", exemple: "Nom du client" },
  { champ: "resume", exemple: "Ce qui a été fait, en une ou deux phrases." },
  { champ: "gain", exemple: "Le résultat mesuré" },
];

/* Échafaudage de développement : retiré du site construit. */
function SansContenu() {
  return (
    <section className="sect sect--gris" id="realisations">
      <div className="wrap">
        <SectionHead
          etiquette="Réalisations"
          titre="Vos réalisations, une fois livrées"
          texte="Les captures d'écran font de jolies pages. Nous préférons montrer ce qui a bougé pour le client après la mise en ligne."
        />
        <Attente
          titre="Aucune réalisation publiée pour l'instant"
          texte="N'y présentez que des missions réellement livrées, avec l'accord du client sur le nom affiché et sur le chiffre annoncé."
          fichier="src/data/site.js"
          cle="realisations"
          gabarit={gabarit}
        />
      </div>
    </section>
  );
}

export default function Work() {
  if (realisations.length === 0) {
    if (!import.meta.env.DEV) return null;
    return <SansContenu />;
  }

  return (
    <section className="sect sect--gris" id="realisations">
      <div className="wrap">
        <SectionHead
          etiquette="Réalisations"
          titre="Nos projets et leurs résultats"
          texte="Les captures d'écran font de jolies pages. Nous préférons montrer ce qui a bougé pour le client après la mise en ligne."
        />

        <>
            <div className="projets">
              {realisations.map((r, i) => (
                <article
                  className="carte carte--leve carte--media carte--colonne projet"
                  key={r.nom}
                  style={{ "--t": r.t, "--d": `${i * 60}ms` }}
                  data-reveal
                >
                  <Media
                    media={medias.projets[r.nom]}
                    ratio="16 / 10"
                    teinte={r.t}
                    repli={r.nom}
                  />

                  <div className="projet__corps">
                    <span className="projet__secteur">{r.secteur}</span>
                    <h3 className="h-m">{r.nom}</h3>
                    <p>{r.resume}</p>

                    <div className="projet__pied">
                      <span className="projet__type">{r.type}</span>
                      <span className="projet__gain">
                        {r.gain}
                        <span>{r.unite}</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="projets__pied" data-reveal>
              <a className="btn btn--trait btn--large" href="#contact">
                Parler de votre projet <Fleche />
              </a>
            </p>
        </>
      </div>
    </section>
  );
}
