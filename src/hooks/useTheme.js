import { useCallback, useEffect, useState } from "react";

const CLE = "tos-theme";

/** Thème servi à qui n'a jamais touché au bouton. */
export const THEME_DEFAUT = "dark";

function lire() {
  try {
    const v = localStorage.getItem(CLE);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* navigation privée ou stockage bloqué */
  }
  return THEME_DEFAUT;
}

/**
 * Le site est sombre par défaut, et ne suit pas le réglage du système : c'est
 * un parti pris d'image de marque, pas une préférence d'affichage. Le visiteur
 * reste libre de basculer en clair, et son choix est retenu dans son
 * navigateur.
 *
 * L'attribut est aussi posé par un script en tête de index.html, avant le
 * premier affichage, sinon la page clignoterait en clair le temps que React
 * démarre.
 */
export function useTheme() {
  const [theme, setTheme] = useState(lire);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(CLE, theme);
    } catch {
      /* sans stockage, le choix ne survit pas au rechargement */
    }
  }, [theme]);

  const basculer = useCallback(() => {
    setTheme((actuel) => (actuel === "dark" ? "light" : "dark"));
  }, []);

  return { theme, basculer };
}
