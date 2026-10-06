import { medias } from "../data/medias.js";
import { preuves, rangs, studio } from "../data/site.js";
import { Etoiles, Fleche, Ico } from "./Icons.jsx";
import Media from "./Media.jsx";

export default function Hero() {
  return (
    <section className="hero" id="haut">
      <div className="hero__trame" aria-hidden="true" />
      <div className="wrap hero__in">
        <div>
          <span className="pastille">
            <Ico nom="epingle" taille={14} /> Agence web à {studio.ville} depuis{" "}
            {studio.depuis}
          </span>

          <h1 className="h-xxl">
            Soyez trouvé{" "}
            <span className="hero__souligne">avant vos concurrents</span>
          </h1>

          <p className="chapo">
            Un site qui s'affiche en moins d'une seconde, qui sort sur les
            recherches de votre métier, et qui transforme les visiteurs en
            demandes de devis. Vous appelez, nous chiffrons sous 48 h, et nous
            bloquons cinq jours : le vendredi suivant, votre site est en ligne.
          </p>

          <div className="hero__cta">
            <a className="btn btn--action btn--large" href="#contact">
              Devis gratuit sous 48 h <Fleche />
            </a>
            <a className="btn btn--trait btn--large" href="#services">
              <Ico nom="cible" taille={17} /> Voir nos services
            </a>
          </div>

          {preuves.length > 0 && (
            <div className="hero__preuves">
              {preuves.map((p) => (
                <span className="preuve" key={p.l}>
                  {p.etoiles && <Etoiles />}
                  <b>{p.v}</b> {p.l}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="hero__visuel">
          <Media
            media={medias.hero}
            ratio="4 / 3"
            priorite
            className="hero__photo"
            repli="Photo de l'agence"
          />

          <div className="carte-vis hero__carte" data-reveal style={{ "--d": "180ms" }}>
            <div className="carte-vis__tete">
              <Ico nom="loupe" taille={15} />
              <span className="carte-vis__url">
                google.ca — votre métier + votre ville
              </span>
            </div>

            <div className="rangs">
              {rangs.map((r) => (
                <div
                  className={r.vous ? "rang rang--nous" : "rang"}
                  key={r.url}
                >
                  <span className="rang__n">{r.n}</span>
                  <span className="rang__t">
                    <b>{r.titre}</b>
                    <span>{r.url}</span>
                  </span>
                  {r.vous && (
                    <span className="rang__m">
                      <Ico nom="cible" taille={12} /> suivi
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="carte-vis__pied">
              <span>Exemple de suivi de positions</span>
              <span>Relevé transmis chaque semaine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
