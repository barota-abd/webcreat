/* ==========================================================================
   Fonction serveur — assistant de qualification du besoin

   Elle existe pour une seule raison : la clé d'API Anthropic ne doit jamais
   atteindre le navigateur. Un appel fait depuis le front exposerait la clé à
   quiconque ouvre l'inspecteur, et la facture suivrait.

   Déployée automatiquement par Vercel : tout fichier de /api devient une
   fonction. En local, « npm run dev » ne la sert pas — il faut « vercel dev ».

   Variable requise : ANTHROPIC_API_KEY, à définir dans les réglages du projet
   Vercel (Settings → Environment Variables), jamais dans le dépôt.
   ========================================================================== */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

/* Bornes de sécurité. Sans elles, n'importe qui peut transformer le
   formulaire en robinet à jetons sur votre compte. */
const MAX_MESSAGES = 24;
const MAX_CARACTERES = 2000;

const SYSTEME = `Tu es l'assistant de pré-qualification d'une agence web québécoise.
Ton rôle : aider un visiteur à décrire son projet, puis lui en rendre un résumé
clair qu'il pourra coller dans le formulaire de contact.

COMMENT TU MÈNES L'ÉCHANGE
- Une seule question à la fois. Jamais deux.
- Six questions au maximum, puis tu rends ton résumé.
- Questions courtes, sans jargon : ton interlocuteur tient un commerce, il n'est
  pas développeur. Ne dis jamais « CMS », « headless », « API » ou « responsive ».
- Reformule ce que tu as compris avant de passer à la question suivante.

CE QUE TU CHERCHES À SAVOIR
1. Ce que fait l'entreprise, et pour qui.
2. Ce qui existe aujourd'hui : rien, un site vieillissant, une page Facebook.
3. Ce que le projet doit changer concrètement : être trouvé, vendre en ligne,
   prendre des réservations, cesser une tâche répétitive.
4. L'échéance souhaitée.
5. Qui fournira les textes et les photos.

TON RÉSUMÉ FINAL
Un court paragraphe à la deuxième personne, prêt à être collé dans le
formulaire, puis cette invitation : « Copiez ce résumé dans le formulaire
ci-dessous, et vous aurez un devis écrit sous 48 h ouvrables. »

CE QUE TU NE FAIS JAMAIS
- Annoncer un prix, même approximatif, même sous forme de fourchette. L'agence
  ne publie aucun tarif : il se donne après un appel de cadrage.
- Promettre un délai autre que celui-ci : un site vitrine se livre en une
  semaine une fois les contenus réunis ; les projets plus lourds ont leurs
  propres délais.
- Prétendre être humain. Si on te le demande, dis que tu es un assistant
  automatisé et qu'une personne prendra le relais.
- Inventer des références, des clients ou des chiffres sur l'agence.
- Sortir du sujet. Si on te parle d'autre chose, ramène poliment au projet.

Réponds en français du Québec, sur un ton direct et chaleureux. Trois phrases
maximum par réponse, sauf pour le résumé final.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erreur: "Méthode non autorisée." });
  }

  const messages = req.body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ erreur: "Conversation absente ou invalide." });
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({
      erreur: "Conversation trop longue. Reprenez depuis le formulaire.",
    });
  }

  /* On ne fait pas confiance au client : chaque tour est revalidé ici. */
  const propres = [];
  for (const m of messages) {
    if (m?.role !== "user" && m?.role !== "assistant") {
      return res.status(400).json({ erreur: "Rôle de message invalide." });
    }
    if (typeof m.content !== "string" || m.content.length === 0) {
      return res.status(400).json({ erreur: "Message vide." });
    }
    propres.push({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) });
  }

  try {
    const reponse = await client.messages.create({
      model: "claude-opus-5-5",
      /* Effort bas : l'échange est conversationnel et doit répondre vite. Le
         défaut de ce modèle est « medium », donc on le pose explicitement. */
      output_config: { effort: "low" },
      /* Volontairement court : l'assistant doit poser une question, pas
         rédiger un dossier. L'instruction de brièveté est dans le système. */
      max_tokens: 1024,
      system: SYSTEME,
      messages: propres,
    });

    /* Les classificateurs de sûreté peuvent décliner : il faut lire
       stop_reason avant de toucher au contenu. */
    if (reponse.stop_reason === "refusal") {
      return res.status(200).json({
        reply:
          "Je préfère ne pas répondre à cette demande. Décrivez-moi plutôt votre projet, ou écrivez-nous directement par le formulaire.",
      });
    }

    const texte = reponse.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({
      reply: texte || "Je n'ai pas de réponse à vous donner. Reformulez ?",
    });
  } catch (e) {
    /* Chaîne du plus précis au plus général : confondre un 429 et un 400
       empêcherait de savoir s'il faut réessayer. */
    if (e instanceof Anthropic.AuthenticationError) {
      console.error("ANTHROPIC_API_KEY absente ou invalide.");
      return res.status(500).json({ erreur: "Assistant indisponible." });
    }
    if (e instanceof Anthropic.RateLimitError) {
      return res
        .status(429)
        .json({ erreur: "Trop de demandes. Réessayez dans un instant." });
    }
    if (e instanceof Anthropic.APIError) {
      console.error("Erreur API Anthropic", e.status, e.message);
      return res.status(502).json({ erreur: "Assistant momentanément indisponible." });
    }
    console.error(e);
    return res.status(500).json({ erreur: "Erreur inattendue." });
  }
}
