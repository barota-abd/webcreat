import { useState } from "react";
import { urlMedia } from "../data/medias.js";

/**
 * Image du site. Trois états possibles :
 *  - chargée : l'image s'affiche, un fondu la révèle ;
 *  - en cours : le cadre garde sa place (aspect-ratio), aucun saut de mise en page ;
 *  - absente : un visuel dessiné prend le relais, avec le texte de repli.
 * Le cadre réserve toujours la place, donc rien ne bouge au chargement.
 */
export default function Media({
  media,
  ratio = "16 / 10",
  teinte,
  rond = false,
  priorite = false,
  repli,
  className = "",
}) {
  const src = urlMedia(media);
  const [pret, setPret] = useState(false);
  const [ko, setKo] = useState(false);

  const style = {
    aspectRatio: rond ? "1 / 1" : ratio,
    ...(teinte ? { "--t": teinte } : null),
  };

  if (ko || !src) {
    return (
      <div
        className={`media media--vide ${rond ? "media--rond" : ""} ${className}`}
        style={style}
        role="img"
        aria-label={media?.alt || repli || "Visuel indisponible"}
      >
        <span>{repli || (media?.alt ? media.alt.split(" ").slice(0, 3).join(" ") : "Visuel")}</span>
      </div>
    );
  }

  return (
    <div
      className={`media ${rond ? "media--rond" : ""} ${pret ? "is-pret" : ""} ${className}`}
      style={style}
    >
      <img
        src={src}
        alt={media?.alt || ""}
        width={media?.l}
        height={media?.h}
        loading={priorite ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setPret(true)}
        onError={() => setKo(true)}
      />
    </div>
  );
}
