import { useState } from "react";
import { medias } from "../data/medias.js";
import { besoins, budgets, echeances, studio } from "../data/site.js";
import { Coche, Fleche, Ico } from "./Icons.jsx";
import Media from "./Media.jsx";

const vide = {
  nom: "",
  email: "",
  tel: "",
  societe: "",
  besoin: besoins[0],
  echeance: echeances[1],
  /* « Je ne sais pas encore » par défaut : poser une fourchette d'office
     ancrerait la réponse, et refuser de répondre doit rester sans friction. */
  budget: budgets[budgets.length - 1],
  message: "",
};

function valider(v) {
  const e = {};
  if (v.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Adresse e-mail invalide.";
  if (v.message.trim().length < 20)
    e.message = "Décrivez le projet en quelques phrases (20 caractères minimum).";
  return e;
}

export default function Contact() {
  const [v, setV] = useState(vide);
  const [err, setErr] = useState({});
  const [envoye, setEnvoye] = useState(false);

  const champ = (cle) => (e) => {
    setV((p) => ({ ...p, [cle]: e.target.value }));
    if (err[cle]) setErr((p) => ({ ...p, [cle]: undefined }));
  };

  function soumettre(e) {
    e.preventDefault();
    const probs = valider(v);
    setErr(probs);
    if (Object.keys(probs).length) {
      document.getElementById(`f-${Object.keys(probs)[0]}`)?.focus();
      return;
    }
    // À brancher sur votre point d'entrée : voir README, section « Formulaire ».
    setEnvoye(true);
  }

  return (
    <section className="sect" id="contact">
      <div className="wrap contact">
        <div data-reveal>
          <span className="pastille pastille--orange">
            <Ico nom="courriel" taille={14} /> Devis gratuit
          </span>
          <h2 className="h-xl" style={{ marginBlock: "1rem 1.1rem" }}>
            Dites-nous ce que vous voulez construire
          </h2>
          <p className="chapo">
            Vous recevez un retour écrit sous 48 h ouvrables : faisabilité,
            fourchette de prix et délai réaliste. Si le projet n'est pas pour
            nous, nous le disons et nous vous orientons ailleurs.
          </p>

          <Media
            media={medias.contact}
            ratio="4 / 3"
            className="contact__visuel"
            repli="Équipe au travail"
          />
        </div>

        {envoye ? (
          <div className="form">
            <div className="envoye">
              <span className="envoye__ok" aria-hidden="true">
                <Coche taille={20} />
              </span>
              <h3 className="h-l">Demande enregistrée</h3>
              <p className="chapo">
                Merci {v.nom.trim().split(" ")[0]}. Nous revenons vers vous à
                l'adresse {v.email.trim()} sous 48 h ouvrables, avec une première
                estimation écrite. Si c'est urgent, appelez le {studio.tel}.
              </p>
              <button
                type="button"
                className="btn btn--trait"
                onClick={() => {
                  setV(vide);
                  setEnvoye(false);
                }}
              >
                Envoyer une autre demande
              </button>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={soumettre} noValidate data-reveal>
            <div className="duo">
              <div className="champ" data-ko={err.nom ? "1" : "0"}>
                <label htmlFor="f-nom">Nom et prénom *</label>
                <input
                  id="f-nom"
                  name="nom"
                  value={v.nom}
                  onChange={champ("nom")}
                  autoComplete="name"
                  placeholder="Prénom Nom"
                />
                {err.nom && <span className="erreur">{err.nom}</span>}
              </div>

              <div className="champ" data-ko={err.email ? "1" : "0"}>
                <label htmlFor="f-email">E-mail *</label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  value={v.email}
                  onChange={champ("email")}
                  autoComplete="email"
                  placeholder="prenom@votre-entreprise.ca"
                />
                {err.email && <span className="erreur">{err.email}</span>}
              </div>
            </div>

            <div className="duo">
              <div className="champ">
                <label htmlFor="f-tel">Téléphone</label>
                <input
                  id="f-tel"
                  name="tel"
                  type="tel"
                  value={v.tel}
                  onChange={champ("tel")}
                  autoComplete="tel"
                  placeholder="Avec l'indicatif régional"
                />
              </div>

              <div className="champ">
                <label htmlFor="f-societe">Société</label>
                <input
                  id="f-societe"
                  name="societe"
                  value={v.societe}
                  onChange={champ("societe")}
                  autoComplete="organization"
                  placeholder="Nom de votre société"
                />
              </div>
            </div>

            <div className="duo">
              <div className="champ">
                <label htmlFor="f-besoin">Votre besoin</label>
                <select
                  id="f-besoin"
                  name="besoin"
                  value={v.besoin}
                  onChange={champ("besoin")}
                >
                  {besoins.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="champ">
                <label htmlFor="f-echeance">Pour quand ?</label>
                <select
                  id="f-echeance"
                  name="echeance"
                  value={v.echeance}
                  onChange={champ("echeance")}
                >
                  {echeances.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Le site n'affiche aucun tarif : cette fourchette remplace la
                grille publique. Elle qualifie sans engager, et dire qu'on ne
                sait pas est une réponse recevable. */}
            <div className="champ">
              <label htmlFor="f-budget">Votre enveloppe, si vous en avez une</label>
              <select
                id="f-budget"
                name="budget"
                value={v.budget}
                onChange={champ("budget")}
              >
                {budgets.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <small className="champ__aide">
                Pour vous proposer quelque chose de réaliste dès le premier
                appel. Rien n'est figé à ce stade.
              </small>
            </div>

            <div className="champ" data-ko={err.message ? "1" : "0"}>
              <label htmlFor="f-message">Votre projet *</label>
              <textarea
                id="f-message"
                name="message"
                value={v.message}
                onChange={champ("message")}
                placeholder="Ce que vous vendez, à qui, ce qui existe déjà, et la date à laquelle vous aimeriez être en ligne."
              />
              {err.message && <span className="erreur">{err.message}</span>}
            </div>

            <div className="form__pied">
              <p className="form__legal">
                Vos informations servent à répondre à cette demande, et à rien
                d'autre. Aucun transfert à un tiers.
              </p>
              <button type="submit" className="btn btn--action btn--large">
                Recevoir mon devis <Fleche />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
