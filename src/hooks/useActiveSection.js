import { useEffect, useState } from "react";

/** Renvoie l'identifiant de la section la plus haute encore visible. */
export function useActiveSection(ids) {
  const [actif, setActif] = useState("");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const vus = new Map();
    const obs = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => vus.set(e.target.id, e.isIntersecting));
        const premier = ids.find((id) => vus.get(id));
        setActif(premier || "");
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [ids]);

  return actif;
}
