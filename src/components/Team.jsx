import { medias } from "../data/medias.js";
import { direction, equipeArgs, studio } from "../data/site.js";
import { Coche, Fleche, Ico } from "./Icons.jsx";
import Media from "./Media.jsx";

export default function Team() {
  // Tant que personne n'est nommé, la fiche reste un bloc de contact neutre
  // plutôt qu'un portrait attribué à quelqu'un qui n'existe pas.
  const nommee = Boolean(direction.nom);

  return (
    <section className="sect sect--gris" id="equipe">
      <div className="wrap equipe">
        <div data-reveal>
          <span className="pastille">
            <Ico nom="humain" taille={14} /> L'agence
          </span>
          <h2 className="h-xl" style={{ marginBlock: "1rem 1.1rem" }}>
            Vous saurez toujours qui travaille sur votre projet
          </h2>
          <p className="chapo">
            Nous sommes à {studio.ville}, et vous pouvez passer nous voir. Pas
            de plateau commercial qui vend puis d'équipe inconnue qui exécute :
            c'est le même interlocuteur du premier appel à la mise en ligne.
          </p>

          <ul className="equipe__liste">
            {equipeArgs.map((a) => (
              <li key={a}>
                <Coche taille={15} />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mosaique" style={{ marginTop: "1.75rem" }}>
            {medias.bureaux.map((b, i) => (
              <Media
                key={b.local}
                media={b}
                ratio={i === 0 ? "16 / 9" : "4 / 3"}
                repli="Photo de vos locaux"
              />
            ))}
          </div>
        </div>

        <div className="carte carte--large carte--forte fiche" data-reveal style={{ "--d": "120ms" }}>
          {nommee ? (
            <>
              <Media
                media={medias.direction}
                rond
                className="portrait--grand"
                repli={direction.ini}
              />
              {direction.mot && (
                <blockquote style={{ margin: 0 }}>
                  <p className="h-m" style={{ lineHeight: 1.45, fontWeight: 700 }}>
                    « {direction.mot} »
                  </p>
                </blockquote>
              )}
              <div>
                <b style={{ fontFamily: "var(--titre)" }}>{direction.nom}</b>
                <br />
                <span style={{ color: "var(--encre-faible)", fontSize: "0.88rem" }}>
                  {direction.role}
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="tuile tuile--grande">
                <Ico nom="telephone" taille={22} />
              </span>
              <p className="h-m" style={{ lineHeight: 1.45 }}>
                Vingt minutes au téléphone suffisent pour savoir si votre projet
                est faisable, combien il coûte et quand il peut être en ligne.
              </p>
              {/* Consigne de développement : absente du site construit. */}
              {import.meta.env.DEV && (
                <p style={{ fontSize: "0.88rem", color: "var(--encre-faible)" }}>
                  Pour mettre une personne en avant ici, renseignez{" "}
                  <code>direction</code> dans <code>src/data/site.js</code>.
                </p>
              )}
            </>
          )}

          <span className="fiche__dispo">
            <span className="point" aria-hidden="true" />
            Du lundi au vendredi, 9 h – 18 h
          </span>

          <a className="btn btn--bleu btn--large" href={`tel:${studio.telBrut}`}>
            <Ico nom="telephone" taille={17} /> {studio.tel}
          </a>
          <a className="lien" href="#contact">
            Ou écrire en deux minutes <Fleche taille={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
