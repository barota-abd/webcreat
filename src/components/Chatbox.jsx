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

const MARQUEUR = "[[RAPPORT]]";

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
  const [termine, setTermine] = useState(null); // null | "cours" | "ok"

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

  async function envoyerRapport(fil) {
    setTermine("cours");
    try {
      const r = await fetch("/api/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: fil.slice(1) }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.erreur) throw new Error(d.erreur || "Envoi impossible.");
      setTermine("ok");
    } catch (err) {
      setTermine(null);
      setErreur(
        "Le résumé n'a pas pu être transmis. Écrivez-nous par le formulaire ci-dessous, nous ne perdrons rien."
      );
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
      const fini = d.reply.includes(MARQUEUR);
      const propreReply = d.reply.replace(MARQUEUR, "").trim();
      const complet = [...suite, { role: "assistant", content: propreReply }];

      setMessages(complet);
      if (fini) envoyerRapport(complet);
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

          {termine === "cours" && <p className="chat__etat">Envoi du résumé…</p>}
          {termine === "ok" && (
            <p className="chat__etat chat__etat--ok">
              C'est transmis. L'équipe revient vers vous sous 48 h ouvrables.
            </p>
          )}

          {erreur && <p className="chat__erreur">{erreur}</p>}
        </div>

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
            placeholder={termine ? "Conversation terminée" : "Je tiens un café…"}
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
