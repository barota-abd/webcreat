import { medias } from "../data/medias.js";
import { etapes } from "../data/site.js";
import { Fleche, Ico } from "./Icons.jsx";
import Media from "./Media.jsx";
import SectionHead from "./SectionHead.jsx";

export default function Process() {
  return (
    <section className="sect" id="methode">
      <div className="wrap">
        <SectionHead
          etiquette="Notre méthode"
          titre="Du premier appel au site en ligne, en une semaine"
          texte="Cinq jours bloqués pour vous, du lundi au vendredi. Chaque étape se valide avant que la suivante démarre, et vous savez à tout moment où vous en êtes. Les projets plus lourds — boutique, application, plateforme — suivent le même déroulé sur une durée adaptée."
        />

        <Media
          media={medias.services.ads}
          ratio="24 / 7"
          className="methode-bandeau"
          repli="Atelier de cadrage"
          data-reveal
        />

        <ol className="etapes">
          {etapes.map((e, i) => (
            <li
              className="carte carte--leve carte--colonne etape"
              key={e.n}
              data-reveal
              style={{ "--d": `${i * 60}ms` }}
            >
              <span className="etape__n">{e.n}</span>
              <h3 className="h-m">{e.titre}</h3>
              <p>{e.texte}</p>
              <span className="etape__d">
                <Ico nom="horloge" taille={14} /> {e.duree}
              </span>
            </li>
          ))}
        </ol>

        <p className="etapes__pied" data-reveal>
          <Ico nom="bouclier" taille={18} />
          <span>
            <b>30 jours de garantie</b> après la mise en ligne : tout correctif
            lié à notre travail est pris en charge, sans discussion.
          </span>
          <a className="lien" href="#contact">
            Démarrer le cadrage <Fleche taille={15} />
          </a>
        </p>
      </div>
    </section>
  );
}
