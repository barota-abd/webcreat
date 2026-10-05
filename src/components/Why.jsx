import { atouts, studio } from "../data/site.js";
import { Ico } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";

export default function Why() {
  return (
    <section className="sect sect--gris">
      <div className="wrap">
        <SectionHead
          etiquette={`Pourquoi ${studio.nom}`}
          titre="Ce que vous obtenez en travaillant avec nous"
          texte="Nous ne sommes pas la moins chère des agences du Grand Montréal. Voici ce que vous obtenez à la place."
        />

        <div className="atouts">
          {atouts.map((a, i) => (
            <article
              className="carte carte--leve atout"
              key={a.titre}
              style={{ "--t": a.t, "--d": `${i * 70}ms` }}
              data-reveal
            >
              <span className="tuile tuile--grande">
                <Ico nom={a.icone} taille={22} />
              </span>
              <h3 className="h-m">{a.titre}</h3>
              <p>{a.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
