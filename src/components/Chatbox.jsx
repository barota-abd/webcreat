import { useEffect, useRef, useState } from "react";
import { Fleche, Ico } from "./Icons.jsx";

/**
 * Assistant de qualification du besoin.
 *
 * Il ne parle jamais directement à Anthropic : tout passe par /api/besoin, où
 * vit la clé. Le composant n'a donc aucun secret à protéger.
 *
 * Le premier message est écrit en dur plutôt que demandé au modèle : il est
 * toujours le même, et le faire générer coûterait un appel pour rien.
 */
/* Le widget n'apparaît pas à l'arrivée : il attend que le visiteur ait eu le
   temps de lire. Surgir immédiatement, c'est la fenêtre qu'on ferme par
   réflexe avant même de l'avoir lue. */
const DELAI_APPARITION = 20000;

const ACCUEIL =
  "Bonjour. Je suis un assistant automatisé. Décrivez-moi votre projet en quelques mots et je vous aide à le mettre au clair — vous pourrez ensuite coller le résumé dans le formulaire.";

export default function Chatbox() {
  const [visible, setVisible] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: ACCUEIL },
  ]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);

  /* Envoi de la fiche à l'agence. Jamais automatique : c'est le visiteur qui
     déclenche, et c'est ce qui rend le traitement licite. */
  const [envoiOuvert, setEnvoiOuvert] = useState(false);
  const [courriel, setCourriel] = useState("");
  const [envoiEtat, setEnvoiEtat] = useState(null); // null | "cours" | "ok"

  const filRef = useRef(null);
  const champRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), DELAI_APPARITION);
    return () => clearTimeout(t);
  }, []);

  // Le fil suit toujours le dernier message.
  useEffect(() => {
    const el = filRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, enCours]);

  useEffect(() => {
    if (ouvert) champRef.current?.focus();
  }, [ouvert]);

  useEffect(() => {
    const onEchap = (e) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", onEchap);
    return () => window.removeEventListener("keydown", onEchap);
  }, []);

  async function envoyerRapport(e) {
    e.preventDefault();
    if (envoiEtat === "cours") return;
    setEnvoiEtat("cours");
    setErreur(null);

    try {
      const r = await fetch("/api/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.slice(1), courriel }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.erreur) throw new Error(d.erreur || "L'envoi a échoué.");
      setEnvoiEtat("ok");
    } catch (err) {
      setEnvoiEtat(null);
      setErreur(
        err.message === "Failed to fetch"
          ? "Connexion impossible. Utilisez le formulaire ci-dessous."
          : err.message
      );
    }
  }

  async function envoyer(e) {
    e.preventDefault();
    const texte = saisie.trim();
    if (!texte || enCours) return;

    const suite = [...messages, { role: "user", content: texte }];
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
      setMessages((m) => [...m, { role: "assistant", content: d.reply }]);
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
          <span className="chat__titre">
            <Ico nom="etincelle" taille={16} />
            Analyser mon besoin
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

          {erreur && <p className="chat__erreur">{erreur}</p>}
        </div>

        {/* Proposé seulement une fois l'échange engagé : avant, il n'y a
            rien à résumer. */}
        {messages.length >= 4 && envoiEtat !== "ok" && (
          <div className="chat__envoi">
            {!envoiOuvert ? (
              <>
                <p className="chat__envoi-titre">Le résumé vous convient ?</p>
                <button
                  type="button"
                  className="btn btn--action chat__envoi-cta"
                  onClick={() => setEnvoiOuvert(true)}
                >
                  Envoyer ce résumé à l'agence <Fleche taille={15} />
                </button>
                <p className="chat__envoi-note">
                  Rien ne nous est transmis tant que vous n'avez pas envoyé.
                </p>
              </>
            ) : (
              <form onSubmit={envoyerRapport}>
                <label htmlFor="chat-courriel">
                  Votre courriel, pour qu'on puisse vous répondre (facultatif)
                </label>
                <div className="chat__envoi-ligne">
                  <input
                    id="chat-courriel"
                    type="email"
                    value={courriel}
                    onChange={(e) => setCourriel(e.target.value)}
                    placeholder="vous@votre-entreprise.ca"
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="btn btn--action"
                    disabled={envoiEtat === "cours"}
                  >
                    {envoiEtat === "cours" ? "Envoi…" : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {envoiEtat === "ok" && (
          <p className="chat__envoi chat__envoi--ok">
            Fiche envoyée. Vous aurez un retour écrit sous 48 h ouvrables.
          </p>
        )}

        <form className="chat__saisie" onSubmit={envoyer}>
          <label className="chat__label" htmlFor="chat-champ">
            Votre message
          </label>
          <input
            id="chat-champ"
            ref={champRef}
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Je tiens un café et je n'ai pas de site…"
            maxLength={2000}
            autoComplete="off"
            disabled={enCours}
          />
          <button
            type="submit"
            className="chat__envoyer"
            disabled={enCours || !saisie.trim()}
            aria-label="Envoyer"
          >
            <Fleche taille={16} />
          </button>
        </form>

        <p className="chat__note">
          Assistant automatisé. Votre conversation disparaît à la fermeture de
          cette fenêtre : elle ne nous est transmise que si vous cliquez sur
          « Envoyer ce résumé à l'agence ».
        </p>
      </div>
    </>
  );
}
