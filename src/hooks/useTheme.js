import { useCallback, useEffect, useState } from "react";

const CLE = "orbite-theme";

function lire() {
  try {
    const v = localStorage.getItem(CLE);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Thème : « null » suit le réglage du système, sinon le choix explicite est
 * posé sur <html data-theme> et retenu dans le navigateur.
 */
export function useTheme() {
  const [theme, setTheme] = useState(lire);

  useEffect(() => {
    const racine = document.documentElement;
    if (theme) racine.setAttribute("data-theme", theme);
    else racine.removeAttribute("data-theme");

    try {
      if (theme) localStorage.setItem(CLE, theme);
      else localStorage.removeItem(CLE);
    } catch {
      /* navigation privée ou stockage bloqué : le thème reste valable pour la session */
    }
  }, [theme]);

  const basculer = useCallback(() => {
    setTheme((actuel) => {
      if (actuel) return actuel === "dark" ? "light" : "dark";
      const sombreSysteme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return sombreSysteme ? "light" : "dark";
    });
  }, []);

  return { theme, basculer };
}
