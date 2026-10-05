export default function SectionHead({
  etiquette,
  titre,
  texte,
  centre = false,
  ton = "",
}) {
  return (
    <div className={centre ? "tete tete--centre" : "tete"} data-reveal>
      {etiquette && (
        <span className={ton ? `pastille pastille--${ton}` : "pastille"}>
          {etiquette}
        </span>
      )}
      <h2 className="h-xl">{titre}</h2>
      {texte && <p className="chapo">{texte}</p>}
    </div>
  );
}
