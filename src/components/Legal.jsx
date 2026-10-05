import { useEffect, useState } from "react";
import { legal } from "../data/site.js";

/**
 * Mentions légales, confidentialité et conditions générales.
 * Repliées par défaut : obligatoires, mais ce n'est pas ce qu'on vient lire.
 * Un lien du pied de page (#confidentialite par exemple) ouvre directement le
 * bon document.
 */
export default function Legal() {
  const [ouvert, setOuvert] = useState(null);

  useEffect(() => {
    const appliquer = () => {
      const id = window.location.hash.slice(1);
      if (!legal.some((d) => d.id === id)) return;
      setOuvert(id);
      const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({
        behavior: doux ? "smooth" : "auto",
        block: "start",
      });
    };
    appliquer();
    window.addEventListener("hashchange", appliquer);
    return () => window.removeEventListener("hashchange", appliquer);
  }, []);

  return (
    <section className="sect sect--serre legal" aria-label="Informations légales">
      <div className="wrap">
        {legal.map((doc) => {
          const actif = ouvert === doc.id;
          return (
            <article className={actif ? "qa is-open" : "qa"} key={doc.id} id={doc.id}>
              <h2 style={{ margin: 0 }}>
                <button
                  type="button"
                  className="qa__q"
                  aria-expanded={actif}
                  aria-controls={`doc-${doc.id}`}
                  onClick={() => setOuvert(actif ? null : doc.id)}
                >
                  <span>{doc.titre}</span>
                  <span className="qa__pm" aria-hidden="true" />
                </button>
              </h2>

              <div className="qa__a" id={`doc-${doc.id}`} role="region">
                <div>
                  <div className="legal__corps">
                    {doc.blocs.map((b) => {
                      // Une valeur non renseignée dans `studio` disparaît
                      // plutôt que de laisser un trou dans le document.
                      const lignes = b.lignes.filter(Boolean);
                      if (lignes.length === 0) return null;
                      return (
                        <div className="legal__bloc" key={b.t}>
                          <h3>{b.t}</h3>
                          {lignes.map((l) => (
                            <p key={l}>{l}</p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
