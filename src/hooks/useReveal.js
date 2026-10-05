import { useEffect } from "react";

/**
 * Révèle les éléments porteurs de `data-reveal` quand ils entrent dans le
 * cadre. Sans JS ni IntersectionObserver, le CSS laisse tout visible : la
 * page est complète au repos.
 */
export function useReveal() {
  useEffect(() => {
    const cibles = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!cibles.length) return;

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduit || !("IntersectionObserver" in window)) {
      cibles.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const obs = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    cibles.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
