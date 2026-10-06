import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import DESIGN from './design.config.js'
import { META, faviconSVG } from './src/designs.meta.js'

const fiche = META[DESIGN] || META.commercial

/* Écrit dans l'en-tête du site construit les balises qui dépendent du design :
 * polices, couleur de barre système et favicon. Les poser ici plutôt qu'en
 * JavaScript évite que le texte attende l'exécution du script pour s'afficher
 * avec la bonne police. En développement, c'est main.jsx qui s'en charge,
 * puisque le design peut changer à chaud. */
function enTeteDuDesign() {
  return {
    name: 'en-tete-du-design',
    apply: 'build',
    transformIndexHtml() {
      return [
        { tag: 'link', attrs: { rel: 'stylesheet', href: fiche.polices }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: faviconSVG(fiche.marque) }, injectTo: 'head' },
        /* Une seule couleur, la sombre : le site l'est par défaut, quel que
         * soit le réglage du système. Une paire de media queries indiquerait
         * au navigateur une couleur que la page n'affiche pas. */
        { tag: 'meta', attrs: { name: 'theme-color', content: fiche.barre.sombre }, injectTo: 'head' },
      ]
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), enTeteDuDesign()],
  resolve: {
    alias: {
      /* En production, la feuille du design retenu est importée statiquement :
       * Vite pose un <link rel="stylesheet"> dans l'en-tête et aucune autre
       * feuille n'entre dans le bundle. En développement, l'alias pointe sur un
       * fichier vide pour que le sélecteur charge n'importe quel design à chaud. */
      '#design': command === 'serve'
        ? '/src/styles/designs/_vide.css'
        : `/src/styles/designs/${DESIGN}.css`,
    },
  },
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: false },
}))
