/* Mesure d'audience Vercel. L'import se fait bien par « /react » : la variante
   « /next » de la documentation ne vaut que pour un projet Next.js, et ce site
   tourne sous Vite. La sonde ne transmet rien en développement. */
import { Analytics } from "@vercel/analytics/react";
import { useMemo } from "react";
import { nav, realisations } from "./data/site.js";
import { useActiveSection } from "./hooks/useActiveSection.js";
import { useReveal } from "./hooks/useReveal.js";
import { useTheme } from "./hooks/useTheme.js";

import Articles from "./components/Articles.jsx";
import CallToAction from "./components/CallToAction.jsx";
import Chatbox from "./components/Chatbox.jsx";
import Contact from "./components/Contact.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Ia from "./components/Ia.jsx";
import Legal from "./components/Legal.jsx";
import Partners from "./components/Partners.jsx";
import Process from "./components/Process.jsx";
import SelecteurDesign from "./components/SelecteurDesign.jsx";
import ServiceTabs from "./components/ServiceTabs.jsx";
import Stats from "./components/Stats.jsx";
import Team from "./components/Team.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Why from "./components/Why.jsx";
import Work from "./components/Work.jsx";

export default function App() {
  // « Réalisations » est le seul lien de nav dont la section peut disparaître.
  const liens = useMemo(
    () =>
      nav.filter(
        (n) =>
          n.id !== "realisations" || realisations.length > 0 || import.meta.env.DEV
      ),
    []
  );
  const ids = useMemo(() => liens.map((n) => n.id), [liens]);
  const actif = useActiveSection(ids);
  const { theme, basculer } = useTheme();
  useReveal();

  return (
    <>
      <a className="saut" href="#principal">
        Aller au contenu
      </a>

      <Header theme={theme} basculer={basculer} actif={actif} liens={liens} />

      <main id="principal">
        <Hero />
        <Partners />
        <Why />
        <ServiceTabs />
        <Stats />
        <Process />
        <Ia />
        <Work />
        <Testimonials />
        <Team />
        <Articles />
        <Faq />
        <CallToAction />
        <Contact />
        <Legal />
      </main>

      <Footer liens={liens} />
      <Chatbox />
      <Analytics />
      <SelecteurDesign />
    </>
  );
}
