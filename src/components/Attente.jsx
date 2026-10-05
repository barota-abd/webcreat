import { Ico } from "./Icons.jsx";

/**
 * État d'attente d'une section dont les données réelles ne sont pas encore
 * saisies. Il nomme ce qui apparaîtra, dit où le remplir, et montre la forme
 * attendue — plutôt que d'afficher du contenu inventé en attendant.
 */
export default function Attente({
  icone = "image",
  teinte = "var(--orange)",
  titre,
  texte,
  fichier,
  cle,
  gabarit = [],
}) {
  return (
    <div className="attente" data-reveal>
      <span className="attente__dev">
        Visible en développement uniquement
      </span>

      <span className="tuile tuile--grande" style={{ "--t": teinte }}>
        <Ico nom={icone} taille={22} />
      </span>

      <h3 className="h-l">{titre}</h3>
      <p className="chapo">{texte}</p>

      <div className="attente__comment">
        <p>
          <b>Pour remplir cette section :</b> complétez le tableau{" "}
          <code>{cle}</code> dans <code>{fichier}</code>. La grille se construit
          ensuite toute seule à partir de vos entrées.
        </p>
      </div>

      {gabarit.length > 0 && (
        <ul className="gabarit">
          {gabarit.map((g) => (
            <li key={g.champ}>
              <code>{g.champ}</code>
              <span>{g.exemple}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
