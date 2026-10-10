import { useEffect, useRef, useState } from "react";
import { medias } from "../data/medias.js";
import { services } from "../data/site.js";
import { Coche, Fleche, Ico } from "./Icons.jsx";
import Media from "./Media.jsx";
import SectionHead from "./SectionHead.jsx";

export default function ServiceTabs() {
  const [actif, setActif] = useState(0);
  const refs = useRef([]);

  // Un lien « #service-seo » ouvre l'onglet correspondant puis fait défiler
  // jusqu'à la section : sans cela, les liens du pied de page tomberaient
  // tous sur le même onglet par défaut.
  useEffect(() => {
    const appliquer = () => {
      const h = window.location.hash;
      if (!h.startsWith("#service-")) return;
      const i = services.findIndex((s) => s.id === h.slice(9));
      if (i === -1) return;
      setActif(i);
      const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("services")?.scrollIntoView({
        behavior: doux ? "smooth" : "auto",
        block: "start",
      });
    };
    appliquer();
    window.addEventListener("hashchange", appliquer);
    return () => window.removeEventListener("hashchange", appliquer);
  }, []);

  // Flèches, Début et Fin : navigation au clavier attendue sur un jeu d'onglets.
  function auClavier(e) {
    const dernier = services.length - 1;
    let cible = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      cible = actif === dernier ? 0 : actif + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      cible = actif === 0 ? dernier : actif - 1;
    if (e.key === "Home") cible = 0;
    if (e.key === "End") cible = dernier;
    if (cible === null) return;
    e.preventDefault();
    setActif(cible);
    refs.current[cible]?.focus();
  }

  const s = services[actif];

  return (
    <section className="sect" id="services">
      <div className="wrap">
        <SectionHead
          etiquette="Nos services"
          titre="Tout ce qu'il faut pour exister en ligne"
          texte="Neuf métiers sous le même toit, du premier site à la reprise d'un applicatif vieux de dix ans. Vous pouvez n'en prendre qu'un, ou nous confier l'ensemble et n'avoir qu'un seul interlocuteur."
        />

        <div className="onglets">
          <div
            className="onglets__liste"
            role="tablist"
            aria-label="Nos services"
            aria-orientation="vertical"
            onKeyDown={auClavier}
          >
            {services.map((o, i) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                id={`onglet-${o.id}`}
                aria-selected={i === actif}
                aria-controls={`panneau-${o.id}`}
                tabIndex={i === actif ? 0 : -1}
                ref={(el) => (refs.current[i] = el)}
                className="onglet"
                style={{ "--t": o.t }}
                onClick={() => setActif(i)}
              >
                <span className="onglet__tuile">
                  <Ico nom={o.icone} taille={17} />
                </span>
                {o.onglet}
              </button>
            ))}
          </div>

          <div
            className="carte carte--large panneau"
            role="tabpanel"
            id={`panneau-${s.id}`}
            aria-labelledby={`onglet-${s.id}`}
            tabIndex={-1}
            style={{ "--t": s.t }}
            key={s.id}
          >
            <Media
              media={medias.services[s.id]}
              ratio="21 / 9"
              teinte={s.t}
              className="panneau__media"
              repli={s.onglet}
            />

            <div className="panneau__tete">
              <span className="tuile tuile--grande">
                <Ico nom={s.icone} taille={22} />
              </span>
              <h3 className="h-l">{s.titre}</h3>
            </div>

            <p className="chapo">{s.texte}</p>

            <ul>
              {s.points.map((p) => (
                <li key={p}>
                  <Coche taille={14} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="panneau__pied">
              <span className="panneau__prix">
                <b>Délai&nbsp;: {s.duree}</b>
                <br />
                Tarif sur devis, chiffré après cadrage
              </span>
              <a className="btn btn--action" href="#contact">
                {s.cta} <Fleche />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
