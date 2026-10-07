import { useEffect, useRef, useState } from "react";
import { Fleche, Ico } from "./Icons.jsx";

/**
 * Assistant de qualification du besoin.
 *
 * Il ne parle jamais directement à Anthropic : tout passe par /api/besoin, où
 * vit la clé. Le composant n'a donc aucun secret à protéger.
 *
 * Fin d'échange : quand l'assistant a résumé le projet et demandé l'adresse
 * courriel, il termine son message par un marqueur. Le composant le retire de
 * l'affichage et déclenche l'envoi des rapports. Le visiteur n'a rien à
 * cliquer — il est prévenu dès l'ouverture que l'échange part à l'équipe.
 */

/* Le widget n'apparaît pas à l'arrivée : il attend que le visiteur ait eu le
   temps de lire. Surgir immédiatement, c'est la fenêtre qu'on ferme par
   réflexe avant même de l'avoir lue. */
const DELAI_APPARITION = 20000;

/* Le modèle doit clore l'échange par ce marqueur. On le reconnaît avec
   tolérance — espaces, casse — parce qu'un marqueur mal formé ne doit pas
   coûter un rapport. */
const MARQUEUR = /\[\[\s*RAPPORT\s*\]\]/i;

/* Filet de sécurité : si le modèle oublie le marqueur alors que le visiteur a
   donné son adresse, l'échange est de toute façon arrivé à son terme. */
const COURRIEL = /[^\s@<>()[\]{},;:"]+@[^\s@<>()[\]{},;:"]+\.[a-zA-Z]{2,}/;

const ACCUEIL =
  "Bonjour ! Racontez-moi ce que vous avez en tête — même en deux mots. Je vous aide à y voir clair, et je prépare un résumé pour l'équipe.";

/* Trois entrées en main pour éviter le champ vide, qui est ce qui fait
   abandonner une fenêtre de discussion. */
const AMORCES = [
  "Je n'ai pas encore de site",
  "Mon site est vieux, je veux le refaire",
  "Je veux vendre en ligne",
];

export default function Chatbox() {
  const [visible, setVisible] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: ACCUEIL },
  ]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [termine, setTermine] = useState(null); // null | "cours" | "ok" | "ko"

  /* Copie au visiteur : un champ dédié plutôt qu'une adresse tapée dans le
     fil. On sait alors que c'en est une, et le visiteur comprend qu'il a
     quelque chose à faire. */
  const [courriel, setCourriel] = useState("");
  const [copie, setCopie] = useState(null); // null | "cours" | "ok" | "ko"

  const filRef = useRef(null);
  const champRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), DELAI_APPARITION);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = filRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, enCours, termine]);

  useEffect(() => {
    if (ouvert) champRef.current?.focus();
  }, [ouvert]);

  useEffect(() => {
    const onEchap = (e) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", onEchap);
    return () => window.removeEventListener("keydown", onEchap);
  }, []);

  /* La fiche part vers l'équipe dès la fin de la qualification, sans attendre
     l'adresse : un visiteur qui s'en va ne doit pas emporter sa demande. */
  async function envoyerRapport(fil) {
    setTermine("cours");
    try {
      const r = await fetch("/api/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: fil.slice(1), cible: "agence" }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.erreur) throw new Error(d.erreur || "Envoi impossible.");
      setTermine("ok");
    } catch (err) {
      setTermine("ko");
      setErreur(
        "Le résumé n'a pas pu être transmis. Écrivez-nous par le formulaire ci-dessous, nous ne perdrons rien."
      );
      console.error(err);
    }
  }

  async function envoyerCopie(e) {
    e.preventDefault();
    if (copie === "cours") return;
    setCopie("cours");
    try {
      const r = await fetch("/api/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.slice(1),
          courriel,
          cible: "client",
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.erreur) throw new Error(d.erreur || "Envoi impossible.");
      setCopie("ok");
    } catch (err) {
      setCopie("ko");
      console.error(err);
    }
  }

  async function demander(texte) {
    const propre = texte.trim();
    if (!propre || enCours || termine) return;

    const suite = [...messages, { role: "user", content: propre }];
    setMessages(suite);
    setSaisie("");
    setErreur(null);
    setEnCours(true);

    try {
      const r = await fetch("/api/besoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Le message d'accueil est retiré : il n'a pas été produit par le
        // modèle, l'envoyer fausserait le fil.
        body: JSON.stringify({ messages: suite.slice(1) }),
      });

      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.erreur || "L'assistant n'a pas répondu.");
      }

      const d = await r.json();
      const marque = MARQUEUR.test(d.reply);
      const adresseDonnee = COURRIEL.test(propre);
      const propreReply = d.reply.replace(MARQUEUR, "").trim();
      const complet = [...suite, { role: "assistant", content: propreReply }];

      setMessages(complet);
      if (marque || adresseDonnee) envoyerRapport(complet);
    } catch (err) {
      setErreur(
        err.message === "Failed to fetch"
          ? "Connexion impossible. Vérifiez votre réseau, ou écrivez-nous par le formulaire."
          : err.message
      );
    } finally {
      setEnCours(false);
    }
  }

  if (!visible) return null;

  const amorcesVisibles = messages.length === 1 && !enCours;

  return (
    <>
      <button
        type="button"
        className="chat-ouvrir"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-controls="assistant-besoin"
      >
        <Ico nom={ouvert ? "croix" : "dialogue"} taille={19} />
        <span>{ouvert ? "Fermer" : "Analyser mon besoin"}</span>
      </button>

      <div
        className="chat"
        id="assistant-besoin"
        role="dialog"
        aria-label="Assistant de qualification du besoin"
        hidden={!ouvert}
      >
        <div className="chat__tete">
          <span className="chat__avatar" aria-hidden="true">
            <Ico nom="etincelle" taille={17} />
          </span>
          <span className="chat__titre">
            Analyser mon besoin
            <small>Assistant automatisé · réponse de l'équipe sous 48 h</small>
          </span>
          <button
            type="button"
            className="chat__fermer"
            onClick={() => setOuvert(false)}
            aria-label="Fermer l'assistant"
          >
            <Ico nom="croix" taille={15} />
          </button>
        </div>

        {/* L'information arrive avant l'échange, pas après : c'est ce qui
            rend la transmission automatique loyale. */}
        <p className="chat__avis">
          Votre échange est transmis à l'équipe à la fin de la conversation.
          Laissez-nous votre courriel pour en recevoir une copie.
        </p>

        <div className="chat__fil" ref={filRef} aria-live="polite">
          {messages.map((m, i) => (
            <p key={i} className={`chat__bulle chat__bulle--${m.role}`}>
              {m.content}
            </p>
          ))}

          {enCours && (
            <p className="chat__bulle chat__bulle--assistant chat__attente">
              <span /> <span /> <span />
            </p>
          )}

          {amorcesVisibles && (
            <div className="chat__amorces">
              {AMORCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="chat__amorce"
                  onClick={() => demander(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          {termine === "cours" && (
            <p className="chat__etat">Transmission à l'équipe…</p>
          )}
          {termine === "ok" && (
            <p className="chat__etat chat__etat--ok">
              C'est transmis. L'équipe revient vers vous sous 48 h ouvrables.
            </p>
          )}

          {erreur && <p className="chat__erreur">{erreur}</p>}
        </div>

        {termine && copie !== "ok" && (
          <form className="chat__copie" onSubmit={envoyerCopie}>
            <label htmlFor="chat-courriel">
              Recevoir une copie de ce résumé par courriel
            </label>
            <div className="chat__copie-ligne">
              <input
                id="chat-courriel"
                type="email"
                required
                value={courriel}
                onChange={(e) => setCourriel(e.target.value)}
                placeholder="vous@votre-entreprise.ca"
                autoComplete="email"
                disabled={copie === "cours"}
              />
              <button
                type="submit"
                className="btn btn--action"
                disabled={copie === "cours"}
              >
                {copie === "cours" ? "Envoi…" : "Recevoir"}
              </button>
            </div>
            {copie === "ko" && (
              <p className="chat__copie-note">
                La copie n'a pas pu partir, mais l'équipe a bien votre demande.
              </p>
            )}
          </form>
        )}

        {copie === "ok" && (
          <p className="chat__copie chat__copie--ok">
            Copie envoyée à {courriel}.
          </p>
        )}

        <form
          className="chat__saisie"
          onSubmit={(e) => {
            e.preventDefault();
            demander(saisie);
          }}
        >
          <label className="chat__label" htmlFor="chat-champ">
            Votre message
          </label>
          <input
            id="chat-champ"
            ref={champRef}
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder={termine ? "Conversation terminée" : "Décrivez votre projet…"}
            maxLength={2000}
            autoComplete="off"
            disabled={enCours || Boolean(termine)}
          />
          <button
            type="submit"
            className="chat__envoyer"
            disabled={enCours || Boolean(termine) || !saisie.trim()}
            aria-label="Envoyer"
          >
            <Fleche taille={16} />
          </button>
        </form>
      </div>
    </>
  );
}
