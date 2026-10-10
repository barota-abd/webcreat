/* ==========================================================================
   Fiche signalétique de chaque design.

   Données pures, sans rien de propre à Vite ni au navigateur : ce fichier est
   lu aussi bien par l'application que par vite.config.js, qui s'en sert pour
   écrire les polices, la couleur de barre système et le favicon directement
   dans l'en-tête du site construit.
   ========================================================================== */

const GF = "https://fonts.googleapis.com/css2?";

export const META = {
  commercial: {
    courriel: {
      fond: "#eef2f9",
      carte: "#ffffff",
      filet: "#dce3f1",
      texte: "#0f1628",
      doux: "#4f5d7c",
      faible: "#8291ae",
      accent: "#1540c9",
      action: "#e65a12",
      titre: "'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif",
      data: "'IBM Plex Mono', Consolas, monospace",
    },
    nom: "Commercial",
    resume: "Bleu et orange sur fond clair, cartes arrondies à ombre douce.",
    polices:
      GF +
      "family=Plus+Jakarta+Sans:wght@600;700;800&family=Hanken+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
    barre: { clair: "#ffffff", sombre: "#0b1120" },
    marque: { trait: "#1540c9", pastille: "#e65a12" },
  },

  pilotage: {
    courriel: {
      fond: "#05070d",
      carte: "#0a0f1a",
      filet: "#1b2535",
      texte: "#dce6f2",
      doux: "#8da0bb",
      faible: "#5d7391",
      accent: "#4de8e0",
      action: "#ffb03a",
      titre: "'Chakra Petch', 'Segoe UI', Tahoma, sans-serif",
      data: "'JetBrains Mono', Consolas, monospace",
    },
    nom: "Poste de pilotage",
    resume:
      "Instrumentation aérospatiale : bleu-nuit, cyan de données, angles coupés.",
    polices:
      GF +
      "family=Chakra+Petch:wght@500;600;700&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    barre: { clair: "#e9eef6", sombre: "#05070d" },
    marque: { trait: "#4de8e0", pastille: "#ffb03a" },
  },

  neon: {
    courriel: {
      fond: "#07050c",
      carte: "#120b1c",
      filet: "#2e1c42",
      texte: "#ede4f5",
      doux: "#a594bc",
      faible: "#6e5c87",
      accent: "#00e5ff",
      action: "#ff2e88",
      titre: "'Orbitron', 'Segoe UI', Tahoma, sans-serif",
      data: "'Space Mono', Consolas, monospace",
    },
    nom: "Néon",
    resume: "Enseigne de nuit : violet-noir, magenta et cyan, contours allumés.",
    polices:
      GF +
      "family=Orbitron:wght@600;700;800&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
    barre: { clair: "#f6f2fb", sombre: "#07050c" },
    marque: { trait: "#00e5ff", pastille: "#ff2e88" },
  },

  holographique: {
    courriel: {
      fond: "#0b0b12",
      carte: "#15151c",
      filet: "#26262f",
      texte: "#f3f2f8",
      doux: "#a9a7bb",
      faible: "#78768c",
      accent: "#a78bfa",
      action: "#67e8f9",
      titre: "'Sora', 'Segoe UI', Helvetica, Arial, sans-serif",
      data: "'IBM Plex Mono', Consolas, monospace",
    },
    nom: "Holographique",
    resume: "Verre dépoli sur anthracite, irisation violet-cyan-rose en fond.",
    polices:
      GF +
      "family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
    barre: { clair: "#f2f1f7", sombre: "#0b0b12" },
    marque: { trait: "#a78bfa", pastille: "#67e8f9" },
  },

  terminal: {
    courriel: {
      fond: "#000000",
      carte: "#070a07",
      filet: "#13251a",
      texte: "#c8dacb",
      doux: "#8ca290",
      faible: "#5f7464",
      accent: "#00ff9c",
      action: "#ffb000",
      titre: "'JetBrains Mono', Consolas, monospace",
      data: "'JetBrains Mono', Consolas, monospace",
    },
    nom: "Terminal phosphore",
    resume: "Écran cathodique : noir absolu, phosphore vert, monospace partout.",
    polices: GF + "family=JetBrains+Mono:wght@400;500;700;800&display=swap",
    barre: { clair: "#f1f4ee", sombre: "#000000" },
    marque: { trait: "#00ff9c", pastille: "#ffb000" },
  },
};

/** Favicon du design, en SVG encodé dans l'adresse. */
export function faviconSVG({ trait, pastille }) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
        `<circle cx="16" cy="16" r="14" fill="none" stroke="${trait}" stroke-width="2"/>` +
        `<circle cx="26" cy="9" r="4" fill="${pastille}"/></svg>`
    )
  );
}
