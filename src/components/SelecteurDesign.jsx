import { useState } from "react";
import { designRetenu, retenirDesign } from "../designs.js";
import { META } from "../designs.meta.js";

/**
 * Sélecteur de design, visible en développement uniquement.
 *
 * Changer de design revient à charger une autre feuille de styles : on
 * recharge donc la page plutôt que de tenter une bascule à chaud, qui
 * laisserait deux systèmes en mémoire. En production, ce panneau n'existe
 * pas — le design servi est celui de design.config.js, et rien d'autre.
 *
 * Les styles sont écrits en ligne, et non dans une feuille : ce panneau doit
 * s'afficher pareil par-dessus les cinq designs, et surtout ne rien laisser
 * dans le site construit.
 */
const S = {
  socle: {
    position: "fixed",
    left: "1rem",
    bottom: "1rem",
    zIndex: 9999,
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
    fontSize: "12px",
    colorScheme: "dark",
  },
  bouton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.8rem",
    background: "#15151c",
    color: "#e8e8f0",
    border: "1px solid #3a3a48",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 6px 20px -8px rgba(0,0,0,.8)",
  },
  pastille: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#f59e0b",
    flex: "none",
  },
  liste: {
    marginTop: "0.5rem",
    width: "min(22rem, calc(100vw - 2rem))",
    background: "#15151c",
    border: "1px solid #3a3a48",
    borderRadius: "8px",
    padding: "0.5rem",
    boxShadow: "0 12px 40px -12px rgba(0,0,0,.9)",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  note: {
    margin: "0.25rem 0.4rem 0.6rem",
    color: "#9a98ab",
    lineHeight: 1.5,
  },
  item: (actif) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "0.55rem 0.6rem",
    marginBottom: "2px",
    background: actif ? "#23232f" : "transparent",
    color: "#e8e8f0",
    border: "1px solid " + (actif ? "#f59e0b" : "transparent"),
    borderRadius: "6px",
    cursor: actif ? "default" : "pointer",
    font: "inherit",
  }),
  resume: { display: "block", color: "#9a98ab", marginTop: "2px", lineHeight: 1.45 },
};

function Panneau() {
  const [ouvert, setOuvert] = useState(false);
  const actuel = designRetenu();

  function choisir(cle) {
    if (cle === actuel) return;
    retenirDesign(cle);
    window.location.reload();
  }

  return (
    <div style={S.socle}>
      {ouvert && (
        <div style={S.liste} role="group" aria-label="Choisir un design">
          <p style={S.note}>
            Visible en développement uniquement. Le site construit sert le
            design défini dans <code>design.config.js</code>, à la racine du
            projet.
          </p>
          {Object.entries(META).map(([cle, d]) => (
            <button
              key={cle}
              type="button"
              style={S.item(cle === actuel)}
              aria-current={cle === actuel}
              onClick={() => choisir(cle)}
            >
              <b>{d.nom}</b>
              <span style={S.resume}>{d.resume}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        style={S.bouton}
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
      >
        <span style={S.pastille} aria-hidden="true" />
        Design : {META[actuel].nom}
      </button>
    </div>
  );
}

export default function SelecteurDesign() {
  if (!import.meta.env.DEV) return null;
  return <Panneau />;
}
