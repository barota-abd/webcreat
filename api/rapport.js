/* ==========================================================================
   Fonction serveur — rapport de qualification

   Deux appels distincts, parce qu'ils n'arrivent pas au même moment :

     cible "agence"  déclenché dès que l'assistant a fini de qualifier.
                     Part toujours, même si le visiteur s'en va ensuite.
                     Contient une analyse du dossier, pas l'échange lui-même.
     cible "client"  déclenché quand le visiteur dépose son adresse dans le
                     champ prévu. N'envoie que sa copie, sans refaire la
                     fiche de l'agence.

   Le visiteur est prévenu dès l'ouverture de la fenêtre que l'échange est
   transmis à l'agence : c'est cette information préalable qui rend le
   traitement licite, puisqu'il n'y a pas de clic de confirmation.

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

/* L'expéditeur de test de Resend ne livre qu'au titulaire du compte : tant
   qu'aucun domaine vérifié n'est configuré, la copie au visiteur est refusée.
   Autant ne pas la lui proposer. */
const COPIE_POSSIBLE = Boolean(process.env.RAPPORT_EXPEDITEUR);

const ANALYSE_AGENCE = `Tu es le stratège d'une agence web québécoise. Tu viens
de lire l'échange entre l'assistant et un visiteur. Tu n'en restitues pas le
déroulé : tu livres ton analyse, celle qu'un collègue d'expérience écrirait à
l'équipe la veille de l'appel de cadrage.

Tu écris pour l'interne : dense, direct, sans préambule ni politesse.

LA RÈGLE QUI PRIME SUR TOUTES LES AUTRES
Ton analyse ne peut pas être plus riche que l'échange. Si la personne a dit
trois phrases, tu rends quelques lignes. Une analyse fournie bâtie sur un
échange maigre est une analyse inventée : elle enverra l'équipe en appel avec
de fausses certitudes. Court et sûr vaut mieux que long et supposé.

Tu sépares strictement ce que tu sais de ce que tu supposes, et rien ne glisse
de la seconde catégorie vers la première.

Rends ces rubriques, dans cet ordre, en texte simple :

CE QU'ON SAIT
Uniquement ce que la personne a dit. Rien d'autre. Si c'est maigre, c'est
maigre, et tu l'écris tel quel.

CE QU'ON EN DÉDUIT
Tes hypothèses, chacune terminée par « (hypothèse) ». Ce que tu sais de ce
genre de commerce a sa place ici, jamais dans la rubrique du dessus. Trois au
maximum, aucune si l'échange ne porte rien.

CE QUE NOUS PROPOSERIONS
Le projet concret : type de site, pages et fonctions à prévoir. Assez précis
pour que l'équipe chiffre en lisant. Quand une pièce dépend d'une réponse
qu'on n'a pas, dis de quelle réponse elle dépend.

CE QUI PEUT COINCER
Seulement ce qui s'appuie sur un signe réel dans l'échange : contenu
introuvable, attente irréaliste, décideur absent de la conversation, échéance
tendue, demande hors de notre périmètre. Rien de tel : écris « rien de
visible ».

TEMPÉRATURE
Froid, tiède ou chaud — et ce qui a été dit qui te le fait penser.

À DEMANDER À L'APPEL
Les trous, formulés comme des questions prêtes à poser. C'est ici que vont
tous les points que la conversation n'a pas abordés, et nulle part ailleurs.

Règles :
- Trois lignes par rubrique au maximum.
- N'invente aucun fait, aucun chiffre, aucune intention, aucun nom.
- N'avance aucun prix et aucun délai : ce n'est pas ton rôle.
- Pas de rubrique en plus. Une rubrique sans matière tient en une ligne.`;

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

const MOTIF_COURRIEL = /^[^\s@<>()[\]{},;:"]+@[^\s@<>()[\]{},;:"]+\.[a-zA-Z]{2,}$/;

async function rediger(systeme, transcription, maxTokens, effort = "low") {
  const r = await claude.messages.create({
    model: "claude-opus-5-5",
    /* Le résumé du visiteur reformule ce qui a été dit ; l'analyse de l'équipe
       doit raisonner sur ce qui ne l'a pas été. D'où deux efforts. */
    output_config: { effort },
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

  const { messages, courriel, cible } = req.body || {};
  const versClient = cible === "client";

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

  const adresse =
    typeof courriel === "string" && MOTIF_COURRIEL.test(courriel.trim())
      ? courriel.trim().slice(0, 254)
      : null;

  if (versClient && !COPIE_POSSIBLE) {
    return res.status(503).json({
      erreur: "L'envoi d'une copie n'est pas disponible pour le moment.",
    });
  }
  if (versClient && !adresse) {
    return res.status(400).json({ erreur: "Adresse courriel invalide." });
  }

  const transcription = propres
    .map((m) => (m.role === "user" ? "VISITEUR : " : "ASSISTANT : ") + m.content)
    .join("\n\n");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    /* ----------------------------------------------- la copie du visiteur */
    if (versClient) {
      const resume = await rediger(RESUME_CLIENT, transcription, 1536);
      if (!resume) {
        return res.status(502).json({ erreur: "Résumé impossible." });
      }

      const envoi = await resend.emails.send({
        from: EXPEDITEUR,
        to: adresse,
        subject: "Votre projet, tel que nous l'avons compris",
        text: resume,
      });

      if (envoi.error) {
        /* Sans domaine vérifié, l'expéditeur de test de Resend ne livre qu'au
           titulaire du compte : c'est précisément cet envoi-là qu'il refuse. */
        console.error(
          "Resend a refusé la copie au visiteur.",
          "destinataire:", adresse,
          "expéditeur:", EXPEDITEUR,
          "détail:", JSON.stringify(envoi.error)
        );
        return res.status(502).json({
          erreur:
            "Nous n'avons pas pu vous envoyer la copie, mais l'équipe a bien reçu votre demande.",
        });
      }

      return res.status(200).json({ ok: true });
    }

    /* --------------------------------------------- l'analyse pour l'équipe */
    const analyse = await rediger(ANALYSE_AGENCE, transcription, 3072, "medium");
    if (!analyse) {
      return res.status(502).json({ erreur: "Résumé impossible." });
    }

    const envoi = await resend.emails.send({
      from: EXPEDITEUR,
      to: process.env.RAPPORT_DESTINATAIRE,
      replyTo: adresse || undefined,
      subject: adresse
        ? `Nouvelle qualification — ${adresse}`
        : "Nouvelle qualification — sans adresse",
      /* Pas de verbatim : l'équipe veut une lecture du dossier, pas une
         relecture de l'échange. */
      text:
        analyse +
        "\n\n— — —\nCourriel du visiteur : " +
        (adresse || "non fourni") +
        "\nAnalyse rédigée automatiquement à partir de l'échange.",
    });

    if (envoi.error) {
      console.error(
        "Resend a refusé l'envoi vers l'agence.",
        "destinataire:", process.env.RAPPORT_DESTINATAIRE,
        "expéditeur:", EXPEDITEUR,
        "détail:", JSON.stringify(envoi.error)
      );
      return res.status(502).json({
        erreur:
          "Le résumé n'a pas pu être expédié. Écrivez-nous par le formulaire, nous ne perdrons rien.",
      });
    }

    return res.status(200).json({ ok: true, copiePossible: COPIE_POSSIBLE });
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
