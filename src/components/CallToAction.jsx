import { studio } from "../data/site.js";
import { Fleche, Ico } from "./Icons.jsx";

export default function CallToAction() {
  return (
    <section className="sect sect--serre">
      <div className="wrap">
        <div className="appel" data-reveal>
          <div className="chiffres__halo" aria-hidden="true" />
          <div style={{ position: "relative", minWidth: 0 }}>
            <h2 className="h-xl">Un projet en tête ?</h2>
            <p>
              Décrivez-le en deux minutes. Vous recevez un retour écrit sous
              48 h ouvrables : faisabilité, fourchette de prix et délai
              réaliste. Sans engagement, et sans qu'on vous relance pendant six
              mois.
            </p>
          </div>

          <div className="appel__btns">
            {studio.tel && (
              <a className="btn btn--clair btn--large" href={`tel:${studio.telBrut}`}>
                <Ico nom="telephone" taille={17} /> {studio.tel}
              </a>
            )}
            <a className="btn btn--action btn--large" href="#contact">
              Devis gratuit <Fleche />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
