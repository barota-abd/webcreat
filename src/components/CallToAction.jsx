import { studio } from "../data/site.js";
import { Fleche, Ico } from "./Icons.jsx";

export default function CallToAction() {
  return (
    <section className="sect sect--serre">
      <div className="wrap">
        <div className="appel" data-reveal>
          <div className="chiffres__halo" aria-hidden="true" />
          <div style={{ position: "relative", minWidth: 0 }}>
            <h2 className="h-xl">Vous préférez en parler de vive voix ?</h2>
            <p>
              Vingt minutes au téléphone suffisent pour savoir si votre projet
              est faisable, combien il coûte et quand il peut être en ligne.
              Sans engagement, et sans qu'on vous rappelle pendant six mois.
            </p>
          </div>

          <div className="appel__btns">
            <a className="btn btn--clair btn--large" href={`tel:${studio.telBrut}`}>
              <Ico nom="telephone" taille={17} /> {studio.tel}
            </a>
            <a className="btn btn--action btn--large" href="#contact">
              Devis gratuit <Fleche />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
