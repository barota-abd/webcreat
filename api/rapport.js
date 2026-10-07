/* ==========================================================================
   Fonction serveur — rapport de qualification

   Déclenchée automatiquement quand l'assistant a terminé son résumé. Elle
   produit deux courriels :

     • à l'agence   — une fiche de qualification structurée, plus la
                      transcription complète ;
     • au visiteur  — le même projet raconté pour lui, s'il a laissé son
                      adresse pendant l'échange.

   Le visiteur est prévenu dès l'ouverture de la fenêtre que l'échange est
   transmis à l'agence : c'est cette information préalable qui rend le
   traitement licite, puisqu'il n'y a plus de clic de confirmation.

   Variables (réglages Vercel, jamais dans le dépôt) :
     ANTHROPIC_API_KEY     déjà en place pour /api/besoin
     RESEND_API_KEY        clé de l'expéditeur
     RAPPORT_DESTINATAIRE  l'adresse de l'agence
     RAPPORT_EXPEDITEUR    facultatif ; sans domaine vérifié, laissez le défaut
   ========================================================================== */

import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const claude = new Anthropic();

const MAX_MESSAGES = 24;
const MAX_CARACTERES = 2000;

const EXPEDITEUR = process.env.RAPPORT_EXPEDITEUR || "onboarding@resend.dev";

const FICHE_AGENCE = `Tu transformes une conversation en fiche de qualification
pour une agence web. Tu écris pour l'équipe, pas pour le visiteur : factuel,
dense, sans politesse.

Rends exactement ces rubriques, dans cet ordre, en texte simple :

ACTIVITÉ
CLIENTÈLE
CE QUI EXISTE AUJOURD'HUI
CE QUE LE PROJET DOIT CHANGER
TYPE DE PROJET PRESSENTI
ÉCHÉANCE
CONTENUS — qui fournit textes et photos
POINTS À CLARIFIER AU CADRAGE
SIGNAUX — urgence, budget serré, projet hors périmètre, hésitation

Règles :
- Une à trois lignes par rubrique.
- Si la conversation n'en dit rien, écris « non abordé ». N'invente jamais.
- N'avance aucun prix et aucun délai : ce n'est pas ton rôle.`;

const RESUME_CLIENT = `Tu écris le courriel qu'une agence web québécoise envoie
à quelqu'un qui vient de discuter avec son assistant.

Ton : chaleureux, direct, comme un artisan qui a bien écouté. Vouvoiement.
Pas de formule creuse, pas de superlatif, pas de vocabulaire technique.

Structure, en texte simple et sans titre de rubrique :
1. Une phrase d'accroche qui montre que vous avez compris son métier.
2. Un paragraphe qui reprend son projet dans ses mots à elle.
3. Une courte liste « Ce dont nous aurons besoin de votre côté » — textes,
   photos, accès — tirée de la conversation.
4. Une dernière phrase : l'équipe revient vers elle sous 48 h ouvrables avec un
   devis écrit.

N'annonce aucun prix et aucun délai de livraison. Signe « L'équipe ».`;

/* L'adresse est cherchée dans ce que le visiteur a écrit, et nulle part
   ailleurs : l'assistant la lui demande à la fin de l'échange. */
const MOTIF_COURRIEL = /[^\s@<>()[\]{},;:"]+@[^\s@<>()[\]{},;:"]+\.[a-zA-Z]{2,}/;

function trouverCourriel(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const t = messages[i].content.match(MOTIF_COURRIEL);
    if (t) return t[0].slice(0, 254);
  }
  return null;
}

async function rediger(systeme, transcription, maxTokens) {
  const r = await claude.messages.create({
    model: "claude-opus-5-5",
    output_config: { effort: "low" },
    max_tokens: maxTokens,
    system: systeme,
    messages: [{ role: "user", content: transcription }],
  });
  if (r.stop_reason === "refusal") return null;
  const t = r.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return t || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erreur: "Méthode non autorisée." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RAPPORT_DESTINATAIRE) {
    console.error("RESEND_API_KEY ou RAPPORT_DESTINATAIRE manquante.");
    return res.status(503).json({ erreur: "Envoi non configuré." });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length < 2) {
    return res.status(400).json({ erreur: "Conversation trop courte." });
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

  const courriel = trouverCourriel(propres);
  const transcription = propres
    .map((m) => (m.role === "user" ? "VISITEUR : " : "ASSISTANT : ") + m.content)
    .join("\n\n");

  try {
    /* Les deux textes sont rédigés en parallèle : ils ne dépendent pas l'un de
       l'autre, et l'attente du visiteur ne doit pas doubler. */
    const [fiche, resume] = await Promise.all([
      rediger(FICHE_AGENCE, transcription, 2048),
      courriel ? rediger(RESUME_CLIENT, transcription, 1536) : Promise.resolve(null),
    ]);

    if (!fiche) {
      return res.status(502).json({ erreur: "Résumé impossible." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const versAgence = await resend.emails.send({
      from: EXPEDITEUR,
      to: process.env.RAPPORT_DESTINATAIRE,
      replyTo: courriel || undefined,
      subject: courriel
        ? `Nouvelle qualification — ${courriel}`
        : "Nouvelle qualification — sans adresse",
      text:
        fiche +
        "\n\n— — —\nCourriel du visiteur : " +
        (courriel || "non fourni") +
        "\n\nTranscription complète :\n\n" +
        transcription,
    });

    if (versAgence.error) {
      /* Cause la plus fréquente : sans domaine vérifié, l'expéditeur de test
         de Resend ne livre qu'à l'adresse du titulaire du compte. Si
         RAPPORT_DESTINATAIRE n'est pas exactement celle-là, l'envoi est
         refusé. Le détail est journalisé pour qu'on puisse le lire. */
      console.error(
        "Resend a refusé l'envoi vers l'agence.",
        "destinataire:", process.env.RAPPORT_DESTINATAIRE,
        "expéditeur:", EXPEDITEUR,
        "détail:", JSON.stringify(versAgence.error)
      );
      return res.status(502).json({
        erreur:
          "Le résumé n'a pas pu être expédié. Écrivez-nous par le formulaire, nous ne perdrons rien.",
      });
    }

    /* Le courriel au visiteur ne doit jamais faire échouer l'opération : la
       fiche est déjà partie, et sans domaine vérifié cet envoi-là est
       précisément celui que Resend refuse. On le signale sans bloquer. */
    let visiteurServi = false;
    if (courriel && resume) {
      const versVisiteur = await resend.emails.send({
        from: EXPEDITEUR,
        to: courriel,
        subject: "Votre projet, tel que nous l'avons compris",
        text: resume,
      });
      if (versVisiteur.error) {
        console.error("Resend (visiteur)", versVisiteur.error);
      } else {
        visiteurServi = true;
      }
    }

    return res.status(200).json({ ok: true, courriel: visiteurServi });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ erreur: "Trop de demandes. Réessayez." });
    }
    if (e instanceof Anthropic.APIError) {
      console.error("Erreur API Anthropic", e.status, e.message);
      return res.status(502).json({ erreur: "Service momentanément indisponible." });
    }
    console.error(e);
    return res.status(500).json({ erreur: "Erreur inattendue." });
  }
}
