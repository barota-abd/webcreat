import { useEffect, useState } from "react";
import { nav, studio } from "../data/site.js";
import { Fleche, Ico, Logo } from "./Icons.jsx";

export default function Header({ theme, basculer, actif, liens = nav }) {
  const [colle, setColle] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setColle(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onEchap = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onEchap);
    return () => window.removeEventListener("keydown", onEchap);
  }, []);

  const sombre =
    theme === "dark" ||
    (!theme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className={colle ? "nav is-stuck" : "nav"}>
      <div className="wrap nav__in">
        <a className="logo" href="#haut" aria-label={`${studio.complet}, retour en haut`}>
          <Logo />
          <span>
            {studio.nom}
            <small>{studio.baseline}</small>
          </span>
        </a>

        <nav className="nav__liens" aria-label="Sections du site">
          {liens.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={actif === n.id ? "nav__lien is-active" : "nav__lien"}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav__droite">
          <button
            type="button"
            className="rond"
            onClick={basculer}
            aria-label={sombre ? "Passer en thème clair" : "Passer en thème sombre"}
          >
            <Ico nom={sombre ? "soleil" : "lune"} taille={17} />
          </button>

          <a className="btn btn--action" href="#contact">
            Devis gratuit <Fleche />
          </a>

          <button
            type="button"
            className="rond nav__burger"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-controls="menu-mobile"
            aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <Ico nom={menu ? "croix" : "menu"} taille={17} />
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!menu}>
        <div className="wrap">
          <div className="volet">
            {liens.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
            <a
              className="btn btn--action btn--large"
              href="#contact"
              onClick={() => setMenu(false)}
            >
              Devis gratuit <Fleche />
            </a>
            {studio.tel && (
              <a className="btn btn--trait" href={`tel:${studio.telBrut}`}>
                <Ico nom="telephone" taille={16} /> {studio.tel}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
