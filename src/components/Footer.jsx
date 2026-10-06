import { bureaux, nav, secteurs, services, servicesIA, studio } from "../data/site.js";
import { Ico, Logo } from "./Icons.jsx";

const reseaux = [
  { cle: "linkedin", nom: "LinkedIn", icone: "linkedin" },
  { cle: "instagram", nom: "Instagram", icone: "instagram" },
  { cle: "facebook", nom: "Facebook", icone: "facebook" },
  { cle: "youtube", nom: "YouTube", icone: "youtube" },
];

/* Le site tient sur une page : chaque lien du pied doit donc mener à une
   ancre qui existe vraiment. Les prestations pointent sur l'onglet concerné
   (#service-<id>), l'offre IA sur sa section, et la colonne « Le site »
   reprend la navigation déjà filtrée des sections vides. */
export default function Footer({ liens = nav }) {
  return (
    <footer className="pied">
      <div className="wrap">
        <div className="pied__cols">
          <div className="pied__col">
            <span className="logo">
              <Logo />
              <span>
                {studio.nom}
                <small>{studio.baseline}</small>
              </span>
            </span>
            <p style={{ marginTop: "0.5rem" }}>
              Création de sites web, applications mobiles et référencement.
              Une équipe à {studio.ville} depuis {studio.depuis}.
            </p>
            {studio.neq && (
              <p style={{ fontSize: "0.82rem", color: "var(--c-faible)" }}>
                {studio.neq}
              </p>
            )}
            <div className="reseaux">
              {reseaux
                .filter((r) => studio.reseaux[r.cle])
                .map((r) => (
                  <a
                    key={r.cle}
                    href={studio.reseaux[r.cle]}
                    aria-label={r.nom}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Ico nom={r.icone} taille={16} />
                  </a>
                ))}
            </div>
          </div>

          <div className="pied__col">
            <h4>Prestations</h4>
            {services.map((s) => (
              <a key={s.id} href={`#service-${s.id}`}>
                {s.onglet}
              </a>
            ))}
          </div>

          <div className="pied__col">
            <h4>Intelligence artificielle</h4>
            {servicesIA.map((o) => (
              <a key={o.id} href="#ia">
                {o.court}
              </a>
            ))}
          </div>

          <div className="pied__col">
            <h4>Le site</h4>
            {liens.map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                {n.label}
              </a>
            ))}
          </div>

          <div className="pied__col">
            <h4>Nous joindre</h4>
            <a href={`tel:${studio.telBrut}`}>{studio.tel}</a>
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
            <p>{studio.ville}</p>
            <p>Du lundi au vendredi, 9 h – 18 h</p>
            <p style={{ color: "var(--c-action)" }}>{studio.delai}</p>
          </div>
        </div>

        {bureaux.length > 0 && (
          <div className="bureaux">
            {bureaux.map((b) => (
              <div className="bureau" key={b.ville}>
                <b>{b.ville}</b>
                <span>{b.adr}</span>
                <span>{b.tel}</span>
              </div>
            ))}
          </div>
        )}

        <div className="secteurs">
          <h4>Secteurs d'activité accompagnés</h4>
          <p className="secteurs__liste">
            {secteurs.join(" · ")}
          </p>
        </div>

        <div className="pied__bas">
          <span>© {studio.depuis}–2026 {studio.complet}. Tous droits réservés.</span>
          <span>Aucun traceur publicitaire, aucun cookie tiers</span>
          <span>
            <a href="#mentions-legales">Mentions légales</a> ·{" "}
            <a href="#confidentialite">Confidentialité</a> ·{" "}
            <a href="#conditions">Conditions</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
