/* Jeu d'icônes dessinées à la main, trait de 1,6 px sur une grille de 24.
   Un seul composant <Ico nom="…" /> pour tout le site. */

const traces = {
  ecran: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5.5h3" />
      <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  loupe: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4l11 5V5L3 10Z" />
      <path d="M14 8.5a3.5 3.5 0 0 1 0 7" />
      <path d="M6 14.5V20h3.5" />
    </>
  ),
  etincelle: (
    <>
      <path d="M12 2.5l1.9 5.1 5.1 1.9-5.1 1.9L12 16.5l-1.9-5.1L5 9.5l5.1-1.9L12 2.5Z" />
      <path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  bouclier: (
    <>
      <path d="M12 2.5 20 5.5v6c0 4.6-3.3 8.6-8 10-4.7-1.4-8-5.4-8-10v-6l8-3Z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  cible: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  eclair: <path d="M13.5 2.5 5 13.5h5l-1.5 8 8.5-11h-5l1.5-8Z" />,
  cle: (
    <>
      <circle cx="8" cy="16" r="4.5" />
      <path d="M11.2 12.8 20 4m-3 0h3v3" />
    </>
  ),
  humain: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M18 14.4c2.1.9 3.5 3 3.5 5.4" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5" />
      <path d="M13.5 4.5l-3 15" />
    </>
  ),
  image: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <circle cx="8" cy="9.5" r="1.8" />
      <path d="M3 17l5-4.5 4 3.5 3-2.5 6 5" />
    </>
  ),
  dialogue: (
    <>
      <path d="M3.5 4.5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5l-4 3v-3h-2a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
      <path d="M18.5 8.5h1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5v2.5l-3-2.5" />
    </>
  ),
  entonnoir: <path d="M3 4.5h18l-7 8v6.4l-4 2.1V12.5l-7-8Z" />,
  document: (
    <>
      <path d="M13 2.5H7A1.5 1.5 0 0 0 5.5 4v16A1.5 1.5 0 0 0 7 21.5h10a1.5 1.5 0 0 0 1.5-1.5V8L13 2.5Z" />
      <path d="M13 2.5V8h5.5" />
      <path d="M8.5 13h7M8.5 16.5h4" />
    </>
  ),
  agenda: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
      <path d="M8.5 14l2 2 4.5-4.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.7 2.6 15.3 0 18-2.6-2.7-2.6-15.3 0-18Z" />
    </>
  ),
  rouages: (
    <>
      <path d="M20.5 11A8.5 8.5 0 0 0 6 6.2M3.5 13A8.5 8.5 0 0 0 18 17.8" />
      <path d="M20.5 6v5h-5M3.5 18v-5h5" />
    </>
  ),
  cadenas: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  balance: (
    <>
      <path d="M12 3.5v17M6.5 20.5h11M3.5 7.5h17M12 7.5 8.5 4.5" />
      <path d="M6.5 8 3.5 14h6l-3-6ZM17.5 8l-3 6h6l-3-6Z" />
    </>
  ),
  graphique: (
    <>
      <path d="M3.5 3.5v17h17" />
      <path d="M7 15.5l4-4.5 3 2.5 5-6" />
    </>
  ),
  telephone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  ),
  courriel: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </>
  ),
  epingle: (
    <>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.5 2" />
    </>
  ),
  fleche: <path d="M4 12h14M13 7l5 5-5 5" />,
  coche: <path d="M4.5 12.5 9 17l10.5-10.5" />,
  soleil: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
    </>
  ),
  lune: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.6 8.6 0 1 0 10.5 10.5Z" />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  croix: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  etoile: (
    <path
      d="M12 3l2.7 5.9 6.3.7-4.7 4.3 1.3 6.1-5.6-3.2-5.6 3.2 1.3-6.1L3 9.6l6.3-.7L12 3Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  facebook: (
    <path
      d="M13.5 21v-7.5h2.6l.4-3h-3V8.8c0-.9.3-1.5 1.6-1.5h1.5V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2h-2.6v3h2.6V21h3.1Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <path
      d="M6.9 20.5H3.8V9.4h3.1v11.1ZM5.3 8A1.8 1.8 0 1 1 5.3 4.4 1.8 1.8 0 0 1 5.3 8ZM20.5 20.5h-3.1v-5.8c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9v6h-3.1s0-9.8 0-10.9h3.1v1.5c.4-.7 1.2-1.6 2.9-1.6 2.2 0 3.9 1.4 3.9 4.5v6.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Ico({ nom, taille = 20, trait = 1.6, ...reste }) {
  const d = traces[nom];
  if (!d) return null;
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={trait}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...reste}
    >
      {d}
    </svg>
  );
}

/** Flèche des boutons : elle glisse au survol via la classe btn__f. */
export function Fleche({ taille = 16 }) {
  return (
    <svg
      className="btn__f"
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h14M13 7l5 5-5 5" />
    </svg>
  );
}

export function Coche({ taille = 15 }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12.5 9 17l10.5-10.5" />
    </svg>
  );
}

export function Etoiles({ note = 5, taille = 14 }) {
  return (
    <span className="etoiles" aria-label={`${note} étoiles sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ico key={i} nom="etoile" taille={taille} />
      ))}
    </span>
  );
}

export function Logo() {
  return (
    <svg className="logo__m" viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="2"
        opacity="0.3"
      />
      <g className="logo__orbe">
        <circle cx="26.8" cy="9.2" r="3.7" fill="var(--c-action)" />
      </g>
      <circle cx="16" cy="16" r="5.2" fill="var(--c-accent)" />
    </svg>
  );
}
