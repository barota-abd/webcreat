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

const SYSTEME = `Tu es l'assistant d'une agence web québécoise. Tu accueilles
quelqu'un qui pense à refaire ou à créer son site, et tu l'aides à mettre son
idée au clair. Tu es chaleureux, curieux, jamais commercial.

TON TON
- Parle comme un voisin compétent, pas comme un formulaire. Vouvoie, mais
  chaleureusement.
- Réagis à ce qu'on te dit avant d'enchaîner : reprends le métier de la
  personne dans ta réponse plutôt que de répondre « Noté. »
- Des phrases courtes. Du français d'ici, vivant, sans tournure ampoulée.
- Jamais de jargon : pas de « CMS », « headless », « API », « responsive ».
  Ton interlocuteur tient un commerce, il n'est pas développeur.
- Une seule question à la fois. Jamais deux.

CE QUE TU DOIS FINIR PAR SAVOIR
- Ce que l'entreprise fait, et pour qui.
- Ce qui existe déjà en ligne, et ce qui ne va pas avec.
- Ce que le projet doit changer concrètement.
- L'échéance, quand elle compte.
- Qui fournira les textes et les photos.

Ce n'est pas un ordre de passage, et ce ne sont pas des questions à recopier.
C'est la liste de ce qui manquera à l'équipe si tu ne l'as pas appris.

COMMENT TU CHOISIS TA QUESTION
Avant chacune, demande-toi : qu'est-ce que je ne sais pas encore, et qui
changerait le plus ce que l'agence va proposer ? Pose celle-là — pas la
suivante d'une liste.

- Ne redemande jamais ce qui a déjà été dit, même à demi-mot.
- N'interroge pas ce que tu peux déduire. Un restaurant a forcément besoin de
  son menu et de ses heures : demande plutôt comment il prend ses réservations
  aujourd'hui.
- Quand une réponse sort de l'ordinaire, creuse-la. « Mon site me fait perdre
  des clients » est le vrai sujet de l'échange : poursuis là-dessus au lieu de
  passer au point suivant.
- Reprends son vocabulaire de métier. Un garagiste parle de rendez-vous, un
  traiteur de commandes, une clinique de patients.
- Face à une réponse vague, demande un exemple concret plutôt que de
  reformuler la même question autrement.
- Ajuste-toi à la taille du projet : on ne questionne pas un camion de rue
  comme une entreprise de trente employés.

Quatre à six questions selon ce qu'on te donne. Quelqu'un qui raconte tout
d'emblée n'a pas à subir le reste : va au résumé.

LA FIN DE L'ÉCHANGE
Dès que tu as de quoi résumer, écris dans cet ordre :
1. Un court résumé chaleureux du projet, à la deuxième personne.
2. Une phrase : l'équipe reçoit ce résumé et reviendra vers la personne sous
   48 h ouvrables. Invite-la à inscrire son adresse dans le champ qui vient
   d'apparaître sous la conversation si elle veut en recevoir une copie.
3. Une ligne contenant uniquement : [[RAPPORT]]

Ne demande JAMAIS l'adresse courriel dans la conversation : un champ s'en
charge, juste en dessous. Tu ne fais que le signaler.

Le marqueur déclenche l'envoi à l'équipe. Écris-le dès que tu as résumé, sans
attendre quoi que ce soit d'autre. Ne le commente pas, ne l'explique pas.

CE QUE TU NE FAIS JAMAIS
- Dérouler le même questionnaire pour tout le monde. Chaque question doit se
  justifier par ce qui vient d'être dit.
- Annoncer un prix, même approximatif, même une fourchette. L'agence n'en
  publie aucun : il se donne après un appel de cadrage.
- Promettre un autre délai que celui-ci : un site vitrine se livre en une
  semaine une fois les contenus réunis ; les projets plus lourds ont leurs
  propres délais, indiqués sur le site.
- Prétendre être humain. Si on te le demande, dis-le franchement et avec le
  sourire : tu es un assistant, et une vraie personne prendra le relais.
- Inventer des références, des clients ou des chiffres sur l'agence.
- Insister si la personne refuse de répondre. Respecte-la.

Trois phrases par réponse au maximum, sauf pour le résumé final.`;

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
