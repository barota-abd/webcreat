import { useEffect, useRef, useState } from "react";
import { chiffres } from "../data/site.js";

/** Compte de 0 à la valeur quand le bandeau entre dans le cadre. */
function useCompteur(cible, lance) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!lance) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(cible);
      return;
    }
    const duree = 900;
    const debut = performance.now();
    let frame = 0;
    const pas = (t) => {
      const p = Math.min(1, (t - debut) / duree);
      // Sortie amortie : la montée ralentit en fin de course.
      setV(Math.round(cible * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(pas);
    };
    frame = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(frame);
  }, [cible, lance]);

  return v;
}

function Chiffre({ valeur, legende, lance }) {
  const entier = /^\d+$/.test(valeur) ? Number(valeur) : null;
  const compte = useCompteur(entier ?? 0, lance && entier !== null);

  return (
    <div className="chiffre">
      <b>{entier !== null ? compte.toLocaleString("fr-FR") : valeur}</b>
      <span>{legende}</span>
    </div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [vu, setVu] = useState(false);
  const aDesChiffres = chiffres.length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVu(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVu(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!aDesChiffres) return null;

  return (
    <section className="sect sect--serre">
      <div className="wrap">
        <div className="chiffres" ref={ref}>
          <div className="chiffres__halo" aria-hidden="true" />
          {chiffres.map((c) => (
            <Chiffre key={c.l} valeur={c.v} legende={c.l} lance={vu} />
          ))}
        </div>
      </div>
    </section>
  );
}
