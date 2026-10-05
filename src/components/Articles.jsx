import { medias } from "../data/medias.js";
import { articles } from "../data/site.js";
import Attente from "./Attente.jsx";
import { Fleche } from "./Icons.jsx";
import Media from "./Media.jsx";
import SectionHead from "./SectionHead.jsx";

const gabarit = [
  { champ: "cat", exemple: "Référencement" },
  { champ: "titre", exemple: "Le titre de l'article publié" },
  { champ: "texte", exemple: "Deux phrases de résumé." },
  { champ: "lien", exemple: "/blog/mon-article" },
];

/* Échafaudage de développement : retiré du site construit. */
function SansContenu() {
  return (
    <section className="sect">
      <div className="wrap">
        <SectionHead
          etiquette="Ressources"
          titre="Ce que vous expliquerez à vos clients"
          texte="Des réponses écrites aux questions qui reviennent, sans jargon et sans formulaire à remplir pour y accéder."
        />
        <Attente
          icone="image"
          teinte="#7c4dd4"
          titre="Aucun article publié pour l'instant"
          texte="Chaque entrée doit renvoyer vers un article réellement rédigé et accessible — une carte qui pointe vers une page inexistante se remarque tout de suite."
          fichier="src/data/site.js"
          cle="articles"
          gabarit={gabarit}
        />
      </div>
    </section>
  );
}

export default function Articles() {
  if (articles.length === 0) {
    if (!import.meta.env.DEV) return null;
    return <SansContenu />;
  }

  return (
    <section className="sect">
      <div className="wrap">
        <SectionHead
          etiquette="Ressources"
          titre="Ce qu'on explique à nos clients"
          texte="Des réponses écrites aux questions qui reviennent, sans jargon et sans formulaire à remplir pour y accéder."
        />

        <div className="articles">
          {articles.map((a, i) => (
            <article
              className="carte carte--leve article"
              key={a.titre}
              data-reveal
              style={{ "--d": `${i * 70}ms` }}
            >
              <Media
                media={medias.articles[i]}
                ratio="16 / 9"
                className="article__media"
                repli={a.cat}
              />
              <div className="article__meta">
                <span className="pastille pastille--orange">{a.cat}</span>
                {a.duree && <span>{a.duree} de lecture</span>}
              </div>
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
              {a.date && <span className="article__date">{a.date}</span>}
              <a className="lien" href={a.lien || "#contact"}>
                Lire l'article <Fleche taille={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
