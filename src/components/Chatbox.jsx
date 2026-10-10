import { useEffect, useRef, useState } from "react";
import { Fleche, Ico } from "./Icons.jsx";

/**
 * Assistant de qualification du besoin.
 *
 * Il ne parle jamais directement à Anthropic : tout passe par /api/besoin, où
 * vit la clé. Le composant n'a donc aucun secret à protéger.
 *
 * L'adresse courriel est demandée AVANT le premier message, pas après. Une
 * qualification sans adresse ne vaut rien : l'équipe lit un beau dossier
 * qu'elle ne peut rappeler. Le prix de ce choix est connu — une porte avant
 * le premier mot fait renoncer une partie des visiteurs — mais un volume de
 * conversations injoignables ne vaut pas mieux que pas de conversation.
 *
 * Fin d'échange : l'assistant termine son résumé par un marqueur. Le composant
 * le retire de l'affichage et transmet la fiche. Le visiteur n'a rien à
 * cliquer : il est prévenu dès l'ouverture que l'échange part à l'équipe.
 */

/* Le widget n'apparaît pas à l'arrivée : il attend que le visiteur ait eu le
   temps de lire. Surgir immédiatement, c'est la fenêtre qu'on ferme par
   réflexe avant même de l'avoir lue. */
const DELAI_APPARITION = 1000;

/* Le modèle doit clore l'échange par ce marqueur. On le reconnaît avec
   tolérance — espaces, casse — parce qu'un marqueur mal formé ne doit pas
   coûter un rapport. */
const MARQUEUR = /\[\[\s*RAPPORT\s*\]\]/i;

/* Filet, et uniquement un filet : si le modèle n'a pas conclu passé ce
   nombre de messages, on transmet plutôt que de perdre l'échange.

   Le compte porte sur les messages, pas sur les questions : accueil, puis
   deux par tour. Le prompt mure à huit questions, soit dix-neuf messages en
   comptant le résumé — le filet doit rester au-dessus, sinon il coupe
   l'assistant au milieu d'une question et la fiche part incomplète. C'est
   ce qu'il faisait à douze. Le serveur refuse au-delà de 24. */
const TOURS_MAX = 21;

/* Même exigence que le serveur : inutile de laisser partir une adresse que
   l'API refusera ensuite. */
const COURRIEL = /^[^\s@<>()[\]{},;:"]+@[^\s@<>()[\]{},;:"]+\.[a-zA-Z]{2,}$/;

/* Le seul message que le modèle n'écrit pas : il arrive avant le premier
   appel. Trois formulations tirées au sort, pour qu'un visiteur qui revient
   ne retrouve pas mot pour mot la même phrase. Il est retiré du fil envoyé
   à l'API, donc le varier n'influence rien. */
const ACCUEILS = [
  "Merci ! Racontez-moi maintenant ce que vous avez en tête — même en deux mots. Je vous aide à y voir clair, et je prépare un résumé pour l'équipe.",
  "Parfait. Alors, qu'est-ce qui vous amène ? Décrivez-le comme ça vient, je m'occupe de mettre de l'ordre et d'en tirer un résumé pour l'équipe.",
  "C'est noté. Dites-moi en quelques mots ce que vous cherchez à faire — on part de là, et je prépare le résumé que l'équipe recevra.",
];

const ACCUEIL = ACCUEILS[Math.floor(Math.random() * ACCUEILS.length)];

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

  /* Le bouton appelle le regard tant qu'on ne l'a pas ouvert. Après, il se
     tait pour de bon : une relance sur quelqu'un qui a déjà répondu n'attire
     plus, elle irrite. */
  const [sollicite, setSollicite] = useState(true);

  /* Rien ne commence tant qu'on ne sait pas à qui répondre. */
  const [courriel, setCourriel] = useState("");
  const [demarre, setDemarre] = useState(false);
  const [refus, setRefus] = useState(null);

  const [messages, setMessages] = useState([
    { role: "assistant", content: ACCUEIL },
  ]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [termine, setTermine] = useState(null); // null | "cours" | "ok" | "ko"

  /* Le serveur dit s'il sait expédier une copie au visiteur : inutile de la
     proposer tant qu'aucun expéditeur vérifié n'est configuré. */
  const [copiePossible, setCopiePossible] = useState(false);
  const [copie, setCopie] = useState(null); // null | "cours" | "ok" | "ko"

  const filRef = useRef(null);
  const champRef = useRef(null);
  const porteRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), DELAI_APPARITION);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = filRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, enCours, termine]);

  /* À l'ouverture le curseur se pose sur la porte d'entrée, puis sur le champ
     de message une fois celle-ci franchie. */
  useEffect(() => {
    if (!ouvert) return;
    if (!demarre) {
      porteRef.current?.focus();
      return;
    }
    /* Le champ est désactivé pendant l'attente, ce qui fait perdre le focus
       au navigateur. On le rend dès qu'il redevient saisissable : sans ça,
       il faut recliquer dans le champ après chaque réponse. */
    if (enCours || termine) return;
    champRef.current?.focus();
  }, [ouvert, demarre, enCours, termine]);

  useEffect(() => {
    const onEchap = (e) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", onEchap);
    return () => window.removeEventListener("keydown", onEchap);
  }, []);

  function ouvrirLaPorte(e) {
    e.preventDefault();
    const propre = courriel.trim();
    if (!COURRIEL.test(propre)) {
      setRefus("Cette adresse ne semble pas valide. Vérifiez-la ?");
      return;
    }
    setCourriel(propre);
    setRefus(null);
    setDemarre(true);
  }

  /* La fiche part vers l'équipe dès la fin de la qualification. L'adresse est
     jointe : c'est tout l'intérêt de l'avoir demandée d'abord. */
  async function envoyerRapport(fil) {
    setTermine("cours");
    try {
      const r = await fetch("/api/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: fil.slice(1),
          courriel,
          cible: "agence",
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.erreur) throw new Error(d.erreur || "Envoi impossible.");
      setCopiePossible(Boolean(d.copiePossible));
      setTermine("ok");
    } catch (err) {
      setTermine("ko");
      setErreur(
        "Le résumé n'a pas pu être transmis. Écrivez-nous par le formulaire ci-dessous, nous ne perdrons rien."
      );
      console.error(err);
    }
  }

  async function envoyerCopie() {
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
      const propreReply = d.reply.replace(MARQUEUR, "").trim();
      const complet = [...suite, { role: "assistant", content: propreReply }];

      setMessages(complet);
      if (marque || complet.length >= TOURS_MAX) envoyerRapport(complet);
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
        className={`chat-ouvrir${sollicite ? "" : " chat-ouvrir--calme"}`}
        onClick={() => {
          setOuvert((v) => !v);
          setSollicite(false);
        }}
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

        {/* L'information arrive avant l'échange, pas après : c'est ce qui rend
            la collecte et la transmission loyales. */}
        <p className="chat__avis">
          Votre adresse sert à vous répondre, rien d'autre. L'échange est
          transmis à l'équipe à la fin de la conversation.
        </p>

        {!demarre ? (
          /* La porte d'entrée. Même habillage que le champ de copie : aucune
             règle de style propre à ajouter dans les cinq designs. */
          <form className="chat__copie" onSubmit={ouvrirLaPorte}>
            <label htmlFor="chat-courriel">
              Votre courriel, pour que l'équipe puisse vous répondre
            </label>
            <div className="chat__copie-ligne">
              <input
                id="chat-courriel"
                ref={porteRef}
                type="email"
                required
                value={courriel}
                onChange={(e) => setCourriel(e.target.value)}
                placeholder="vous@votre-entreprise.ca"
                autoComplete="email"
              />
              <button type="submit" className="btn btn--action">
                Commencer
              </button>
            </div>
            {refus && <p className="chat__copie-note">{refus}</p>}
          </form>
        ) : (
          <>
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
                  C'est transmis. L'équipe revient vers vous sous 48 h
                  ouvrables, à {courriel}.
                </p>
              )}

              {erreur && <p className="chat__erreur">{erreur}</p>}
            </div>

            {/* L'adresse est déjà connue : plus rien à saisir, un seul geste. */}
            {termine === "ok" && copiePossible && copie !== "ok" && (
              <div className="chat__copie">
                <div className="chat__copie-ligne">
                  <button
                    type="button"
                    className="btn btn--action"
                    onClick={envoyerCopie}
                    disabled={copie === "cours"}
                  >
                    {copie === "cours" ? "Envoi…" : "M'envoyer une copie"}
                  </button>
                </div>
                {copie === "ko" && (
                  <p className="chat__copie-note">
                    La copie n'a pas pu partir, mais l'équipe a bien votre
                    demande.
                  </p>
                )}
              </div>
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
                placeholder={
                  termine ? "Conversation terminée" : "Décrivez votre projet…"
                }
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
          </>
        )}
      </div>
    </>
  );
}
