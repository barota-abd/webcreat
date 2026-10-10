import { gardesIA, servicesIA } from "../data/site.js";
import { Coche, Fleche, Ico } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";

export default function Ia() {
  return (
    <section className="sect" id="ia">
      <div className="wrap">
        <SectionHead
          etiquette="Intelligence artificielle"
          ton="orange"
          titre="Faire traiter par une machine ce qui se répète"
          texte="L'IA utile dans une entreprise, ce n'est pas un chatbot posé sur un site. C'est une tâche précise, chronométrée avant et après, confiée à une machine parce qu'elle la fait mieux — et rendue à un humain quand ce n'est pas le cas."
        />

        <div className="offres">
          {servicesIA.map((o, i) => (
            <article
              className="carte carte--leve carte--accent carte--colonne offre"
              key={o.id}
              style={{ "--t": o.t, "--d": `${i * 60}ms` }}
              data-reveal
            >
              <span className="tuile tuile--grande">
                <Ico nom={o.icone} taille={22} />
              </span>

              <h3 className="h-m">{o.titre}</h3>
              <p className="offre__texte">{o.texte}</p>

              <ul className="offre__fait">
                {o.fait.map((f) => (
                  <li key={f}>
                    <Coche taille={13} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="offre__pied">
                <b>Sur devis</b>
                <span>Durée selon le périmètre</span>
              </div>
            </article>
          ))}
        </div>

        {/* Ce qui distingue une mission IA : l'audit precede l'outil. Le
            deroule complet vit dans la section Methode, pas ici. */}
        <div className="ia-promesse" data-reveal>
          <span className="tuile tuile--grande" style={{ "--t": "var(--c-ok)" }}>
            <Ico nom="bouclier" taille={22} />
          </span>
          <div>
            <h3 className="h-l">L'audit d'abord, l'outil ensuite</h3>
            <p>
              La plupart des projets d'IA échouent parce qu'ils commencent par
              choisir une technologie. Nous commençons par chronométrer ce que
              vos équipes refont tous les jours, puis nous testons sur une
              seule tâche avant d'engager le budget complet.{" "}
              <b>
                Si l'audit conclut qu'aucune tâche ne mérite d'être automatisée
                chez vous, nous vous le disons et nous nous arrêtons là.
              </b>
            </p>
            <a className="lien" href="#methode">
              Voir le déroulé complet d'un projet <Fleche taille={15} />
            </a>
          </div>
        </div>

        <div className="gardes">
          <h3 className="h-l gardes__t" data-reveal>
            Ce sur quoi nous nous engageons
          </h3>
          <div className="gardes__grille">
            {gardesIA.map((g, i) => (
              <article
                className="carte carte--plat garde"
                key={g.titre}
                style={{ "--t": g.t, "--d": `${i * 60}ms` }}
                data-reveal
              >
                <span className="tuile">
                  <Ico nom={g.icone} taille={18} />
                </span>
                <h4 className="h-m">{g.titre}</h4>
                <p>{g.texte}</p>
              </article>
            ))}
          </div>
        </div>

        <p className="offres__pied" data-reveal>
          <a className="btn btn--action btn--large" href="#contact">
            Demander l'audit des tâches <Fleche />
          </a>
          <span>Facturé à part, et déduit du projet si vous nous le confiez.</span>
        </p>
      </div>
    </section>
  );
}
