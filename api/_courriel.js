/* ==========================================================================
   Gabarit des courriels

   Un client de messagerie n'est pas un navigateur : pas de variable CSS, pas
   de flexbox, pas de grille, et une feuille de styles externe est souvent
   ignorée ou retirée. Tout est donc en tableaux et en styles sur l'attribut
   `style`, comme en 2003 — c'est laid à écrire, c'est ce qui s'affiche.

   La palette vient de src/designs.meta.js, qui est déjà lu par l'application
   et par vite.config.js. Le courriel suit donc design.config.js au même titre
   que le site : changez le design, le message change avec lui.

   Le préfixe « _ » tient ce fichier hors des routes : Vercel ne publie pas
   les modules d'un dossier /api dont le nom commence par un souligné.
   ========================================================================== */

import design from "../design.config.js";
import { META } from "../src/designs.meta.js";

const PALETTE = META[design]?.courriel || META.commercial.courriel;

/* Le contenu vient d'un modèle de langage, donc d'une personne en amont :
   il n'entre jamais dans le HTML sans être neutralisé. */
function echappe(t) {
  return String(t ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

/* Une rubrique est une ligne sans aucune minuscule : « TEMPÉRATURE » en est
   une, « « moche » ne fournit aucune direction » n'en est pas. Plus robuste
   que de comparer à une liste de titres que le prompt pourrait faire varier. */
function estRubrique(ligne) {
  const t = ligne.trim();
  if (t.length < 3 || t.length > 60) return false;
  if (/\p{Ll}/u.test(t)) return false;
  return /\p{Lu}/u.test(t);
}

/** Découpe le texte du modèle en [{ titre, lignes }]. */
function enRubriques(texte) {
  const blocs = [];
  let courant = null;
  for (const brute of String(texte).split("\n")) {
    const l = brute.trim();
    if (!l) continue;
    if (estRubrique(l)) {
      courant = { titre: l, lignes: [] };
      blocs.push(courant);
    } else if (courant) {
      courant.lignes.push(l);
    } else {
      /* Du texte avant la première rubrique : un résumé en prose. */
      courant = { titre: null, lignes: [l] };
      blocs.push(courant);
    }
  }
  return blocs;
}

const P = PALETTE;

function rubrique({ titre, lignes }) {
  /* Les questions à poser sont la seule partie actionnable : elle prend la
     couleur d'action, le reste celle d'appui. */
  const teinte = titre && /DEMANDER|APPEL/i.test(titre) ? P.action : P.accent;

  const entete = titre
    ? `<tr><td style="padding:0 0 10px;font-family:${P.data};font-size:11px;` +
      `line-height:1.3;letter-spacing:1.6px;text-transform:uppercase;` +
      `color:${teinte};font-weight:700;">${echappe(titre)}</td></tr>`
    : "";

  const corps = lignes
    .map(
      (l) =>
        `<tr><td style="padding:0 0 7px;font-family:${P.titre};font-size:14px;` +
        `line-height:1.62;color:${P.texte};">${echappe(l)}</td></tr>`
    )
    .join("");

  return (
    `<tr><td style="padding:0 0 22px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    `<tr><td style="border-left:2px solid ${teinte};padding:2px 0 2px 14px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    entete +
    corps +
    `</table></td></tr></table></td></tr>`
  );
}

/**
 * Enveloppe commune aux deux courriels.
 *
 * @param {object} o
 * @param {string} o.titre      ce qui s'affiche en gros, en tête
 * @param {string} o.surtitre   la ligne discrète au-dessus
 * @param {string} o.corps      le HTML déjà assemblé
 * @param {string} [o.apercu]   le texte que la boîte de réception montre
 * @param {string} [o.pied]     la mention de bas de message
 */
function enveloppe({ titre, surtitre, corps, apercu = "", pied = "" }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${echappe(titre)}</title>
</head>
<body style="margin:0;padding:0;background:${P.fond};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${echappe(apercu)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${P.fond};">
  <tr><td align="center" style="padding:28px 14px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

      <!-- l'en-tête reprend la marque : trait d'appui, pastille d'action -->
      <tr><td style="padding:0 0 18px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:26px;height:4px;background:${P.accent};font-size:0;line-height:0;">&nbsp;</td>
            <td style="width:8px;font-size:0;line-height:0;">&nbsp;</td>
            <td style="width:10px;height:4px;background:${P.action};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="background:${P.carte};border:1px solid ${P.filet};padding:30px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

          <tr><td style="padding:0 0 4px;font-family:${P.data};font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:${P.faible};">${echappe(surtitre)}</td></tr>
          <tr><td style="padding:0 0 24px;font-family:${P.titre};font-size:21px;line-height:1.3;font-weight:700;color:${P.texte};">${echappe(titre)}</td></tr>

          ${corps}

        </table>
      </td></tr>

      ${
        pied
          ? `<tr><td style="padding:16px 4px 0;font-family:${P.data};font-size:11px;line-height:1.6;color:${P.faible};">${echappe(pied)}</td></tr>`
          : ""
      }

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Courriel de l'équipe : l'analyse, en rubriques, avec l'adresse en tête. */
export function htmlFiche({ analyse, adresse }) {
  const blocs = enRubriques(analyse).map(rubrique).join("");

  /* L'adresse est la raison d'être de la fiche : elle passe avant l'analyse,
     cliquable, pour répondre sans la recopier. */
  const contact = adresse
    ? `<tr><td style="padding:0 0 24px;">
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${P.fond};border:1px solid ${P.filet};">
           <tr><td style="padding:13px 16px;">
             <div style="font-family:${P.data};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${P.faible};padding-bottom:4px;">Répondre à</div>
             <a href="mailto:${encodeURIComponent(adresse).replace(/%40/g, "@")}" style="font-family:${P.titre};font-size:16px;font-weight:700;color:${P.action};text-decoration:none;">${echappe(adresse)}</a>
           </td></tr>
         </table>
       </td></tr>`
    : `<tr><td style="padding:0 0 24px;font-family:${P.titre};font-size:14px;color:${P.doux};">Aucune adresse laissée : cette personne n'est pas joignable.</td></tr>`;

  return enveloppe({
    surtitre: "Qualification",
    titre: adresse ? `Nouvelle demande — ${adresse}` : "Nouvelle demande",
    apercu: analyse.split("\n").find((l) => l.trim() && !estRubrique(l)) || "",
    corps: contact + blocs,
    pied: "Analyse rédigée automatiquement à partir de l'échange avec l'assistant. La conversation elle-même n'est pas conservée.",
  });
}

/** Courriel du visiteur : de la prose, pas des rubriques. */
export function htmlResume({ resume }) {
  const corps = String(resume)
    .split(/\n\s*\n/)
    .map((bloc) => bloc.trim())
    .filter(Boolean)
    .map((bloc) => {
      /* Le prompt demande une courte liste : les puces gardent leur retrait. */
      const puce = /^[-•]\s+/.test(bloc);
      const texte = echappe(bloc.replace(/^[-•]\s+/, "")).replace(
        /\n/g,
        "<br>"
      );
      return (
        `<tr><td style="padding:0 0 14px${puce ? ";padding-left:14px;border-left:2px solid " + P.accent : ""};` +
        `font-family:${P.titre};font-size:15px;line-height:1.68;color:${P.texte};">${texte}</td></tr>`
      );
    })
    .join("");

  return enveloppe({
    surtitre: "Votre projet",
    titre: "Ce que nous avons compris",
    apercu: String(resume).split("\n")[0] || "",
    corps,
    pied: "Vous recevez ce message parce que vous avez décrit votre projet à notre assistant. L'équipe revient vers vous sous 48 h ouvrables.",
  });
}
