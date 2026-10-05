import { useState } from "react";
import { faq } from "../data/site.js";
import SectionHead from "./SectionHead.jsx";

export default function Faq() {
  const [ouvert, setOuvert] = useState(0);

  return (
    <section className="sect sect--gris">
      <div className="wrap">
        <SectionHead
          centre
          etiquette="Questions fréquentes"
          titre="Les questions qu'on nous pose toujours"
          texte="Si la vôtre n'y est pas, écrivez-nous : nous répondons par écrit, sans rendez-vous obligatoire."
        />

        <div className="faq">
          {faq.map((item, i) => {
            const actif = ouvert === i;
            return (
              <div className={actif ? "qa is-open" : "qa"} key={item.q}>
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="qa__q"
                    id={`q-${i}`}
                    aria-expanded={actif}
                    aria-controls={`a-${i}`}
                    onClick={() => setOuvert(actif ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className="qa__pm" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="qa__a"
                  id={`a-${i}`}
                  role="region"
                  aria-labelledby={`q-${i}`}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
