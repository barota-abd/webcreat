/* ==========================================================================
   Fonction serveur — rapport de qualification envoyé par courriel

   Le visiteur a discuté avec l'assistant ; s'il le demande, on résume la
   conversation en fiche structurée et on l'envoie à l'agence.

   L'envoi n'a lieu que sur action explicite du visiteur : c'est ce qui rend
   le traitement licite. Rien ne part automatiquement.

   Variables requises (réglages Vercel, jamais dans le dépôt) :
     ANTHROPIC_API_KEY   déjà en place pour /api/besoin
     RESEND_API_KEY      clé de l'expéditeur de courriel
     RAPPORT_DESTINATAIRE  l'adresse qui reçoit les fiches
     RAPPORT_EXPEDITEUR  facultatif ; sans domaine vérifié, laissez le défaut
   ========================================================================== */

import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const claude = new Anthropic();

const MAX_MESSAGES = 24;
const MAX_CARACTERES = 2000;

/* Tant qu'aucun domaine n'est vérifié, Resend n'accepte que son expéditeur de
   test — qui ne livre qu'à l'adresse du titulaire du compte. C'est suffisant
   ici : la fiche part vers l'agence, pas vers le visiteur. */
const EXPEDITEUR = process.env.RAPPORT_EXPEDITEUR || "onboarding@resend.dev";

const SYSTEME = `Tu transformes une conversation en fiche de qualification pour
une agence web. Tu écris pour l'équipe de l'agence, pas pour le visiteur.

Rends exactement ces rubriques, dans cet ordre, en texte simple :

ACTIVITÉ
QUI SONT SES CLIENTS
CE QUI EXISTE AUJOURD'HUI
CE QUE LE PROJET DOIT CHANGER
TYPE DE PROJET PRESSENTI
ÉCHÉANCE
CONTENUS — qui fournit textes et photos
POINTS À CLARIFIER AU CADRAGE

Règles :
- Une à trois lignes par rubrique, factuelles.
- Si la conversation ne dit rien sur une rubrique, écris « non abordé ».
  N'invente jamais pour combler.
- N'avance aucun prix et aucun délai de livraison : ce n'est pas ton rôle.
- Termine par une ligne « SIGNAUX » : ce qui mérite l'attention de l'équipe —
  urgence, budget serré, projet hors périmètre, interlocuteur hésitant.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erreur: "Méthode non autorisée." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RAPPORT_DESTINATAIRE) {
    console.error("RESEND_API_KEY ou RAPPORT_DESTINATAIRE manquante.");
    return res.status(503).json({
      erreur: "L'envoi par courriel n'est pas configuré. Utilisez le formulaire.",
    });
  }

  const { messages, courriel } = req.body || {};

  if (!Array.isArray(messages) || messages.length < 2) {
    return res.status(400).json({ erreur: "Conversation trop courte à résumer." });
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ erreur: "Conversation trop longue." });
  }

  const propres = [];
  for (const m of messages) {
    if (m?.role !== "user" && m?.role !== "assistant") {
      return res.status(400).json({ erreur: "Rôle de message invalide." });
    }
    if (typeof m.content !== "string" || !m.content) {
      return res.status(400).json({ erreur: "Message vide." });
    }
    propres.push({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) });
  }

  /* Le courriel du visiteur est facultatif : il sert à lui répondre, pas à
     l'identifier. On le valide sans le rendre obligatoire. */
  const courrielPropre =
    typeof courriel === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel.trim())
      ? courriel.trim().slice(0, 254)
      : null;

  const transcription = propres
    .map((m) => (m.role === "user" ? "VISITEUR : " : "ASSISTANT : ") + m.content)
    .join("\n\n");

  try {
    const reponse = await claude.messages.create({
      model: "claude-opus-5-5",
      output_config: { effort: "low" },
      max_tokens: 2048,
      system: SYSTEME,
      messages: [{ role: "user", content: transcription }],
    });

    if (reponse.stop_reason === "refusal") {
      return res.status(200).json({
        erreur: "Résumé impossible pour cette conversation. Utilisez le formulaire.",
      });
    }

    const fiche = reponse.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!fiche) {
      return res.status(502).json({ erreur: "Résumé vide. Utilisez le formulaire." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EXPEDITEUR,
      to: process.env.RAPPORT_DESTINATAIRE,
      replyTo: courrielPropre || undefined,
      subject: courrielPropre
        ? `Qualification — ${courrielPropre}`
        : "Qualification — visiteur anonyme",
      text:
        fiche +
        "\n\n— — —\nCourriel du visiteur : " +
        (courrielPropre || "non fourni") +
        "\n\nTranscription complète :\n\n" +
        transcription,
    });

    if (error) {
      console.error("Resend", error);
      return res.status(502).json({
        erreur: "L'envoi a échoué. Utilisez le formulaire ci-dessous.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ erreur: "Trop de demandes. Réessayez dans un instant." });
    }
    if (e instanceof Anthropic.APIError) {
      console.error("Erreur API Anthropic", e.status, e.message);
      return res.status(502).json({ erreur: "Service momentanément indisponible." });
    }
    console.error(e);
    return res.status(500).json({ erreur: "Erreur inattendue." });
  }
}
