# 📱 FocusTask - Frontend PWA

> Application de gestion de tâches avec système de récompenses et achievements - Progressive Web App

[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success)](https://web.dev/progressive-web-apps/)

## ✨ Fonctionnalités

- 📝 **Gestion de tâches** avec vue hebdomadaire
- 🏆 **Système d'achievements** pour la motivation
- 🎁 **Récompenses** basées sur les accomplissements
- 📊 **Système de progression** avec niveaux et expérience
- 📱 **PWA complète** - Installable et offline-first
- 🎨 **Design responsive** - Mobile, tablet, desktop
- ⚡ **Performance optimale** - Cache intelligent et lazy loading
- 🌙 **Mode hors ligne** - Fonctionne sans connexion
- 🔔 **Bannière d'installation** - Encourage l'installation native

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install

# Générer les icônes PWA
npm run generate-icons

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build Production

```bash
# Build optimisé
npm run build

# Preview du build
npm run preview
```

## 📱 PWA (Progressive Web App)

Cette application est une **PWA complète** avec toutes les fonctionnalités modernes :

### Installation
- **Desktop** : Bouton d'installation dans la barre d'adresse
- **Android** : "Ajouter à l'écran d'accueil" via Chrome
- **iOS** : "Sur l'écran d'accueil" via Safari

### Mode Offline
- Cache intelligent des ressources
- Fonctionne sans connexion internet
- Synchronisation automatique au retour en ligne

### Documentation PWA
- 📖 [Guide PWA complet](./PWA-README.md)
- 🚀 [Guide de démarrage](./GUIDE-PWA.md)
- ✅ [Checklist PWA](./PWA-CHECKLIST.md)
- 🎨 [Guide visuel](./VISUAL-GUIDE.md)
- 📝 [Résumé des modifications](./PWA-SUMMARY.md)

## 🎨 Design Responsive

### Points de rupture
- **Mobile** : < 480px (1 colonne)
- **Tablet** : 480-768px (1 colonne)
- **Desktop** : 768-1200px (4 colonnes)
- **Large** : > 1200px (7 colonnes)

### Navigation
- **Mobile** : Menu hamburger avec overlay
- **Desktop** : Sidebar fixe

## 🛠️ Technologies

- **React 19** - Framework UI moderne
- **TypeScript** - Type safety
- **Vite 7** - Build tool ultra-rapide
- **vite-plugin-pwa** - Configuration PWA automatique
- **Workbox** - Service Worker et cache
- **React Router** - Navigation SPA
- **Axios** - Client HTTP
- **Sharp** - Génération d'icônes optimisées

## 📦 Scripts Disponibles

```bash
npm run dev          # Développement avec hot reload
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Linter ESLint
npm run generate-icons  # Générer les icônes PWA
```

## 🏗️ Structure du Projet

```
frontend/
├── public/
│   ├── manifest.json       # Configuration PWA
│   ├── sw.js              # Service Worker
│   ├── offline.html       # Page offline
│   ├── icon-base.svg      # Icône source
│   └── icons/             # Icônes générées (72-512px)
├── src/
│   ├── components/        # Composants React
│   │   ├── Header/       # Header avec menu hamburger
│   │   ├── InstallPWA/   # Bannière d'installation
│   │   └── Modal/        # Modals (Task, Profile)
│   ├── pages/            # Pages de l'application
│   │   ├── Tasks/       # Gestion des tâches
│   │   ├── Achievements/ # Succès et achievements
│   │   ├── Rewards/     # Système de récompenses
│   │   ├── Profile/     # Profil utilisateur
│   │   └── Settings/    # Paramètres
│   ├── services/         # Services API
│   ├── context/          # React Context (Auth)
│   ├── hooks/            # Custom hooks
│   ├── router/           # Configuration React Router
│   └── styles/           # Styles globaux et mobile
└── scripts/
    └── generate-icons.js # Script de génération d'icônes
```

## 🔌 API Backend

L'application se connecte au backend via l'API REST :
- **Dev** : `http://localhost:3000/api`
- **Prod** : Configuré via proxy Vite

Voir [../backend/README.md](../backend/README.md) pour la documentation de l'API.

## ✅ Checklist PWA

- ✅ Manifest.json configuré
- ✅ Service Worker actif
- ✅ Icônes 72-512px générées
- ✅ Mode offline fonctionnel
- ✅ Installation possible
- ✅ Responsive design
- ✅ Touch-friendly (≥ 44px)
- ✅ HTTPS ready
- ✅ Meta tags PWA
- ✅ Cache strategy optimale

## 🧪 Tests

### Test Local
```bash
npm run build
npm run preview
# Ouvrir DevTools → Application → Service Workers
```

### Lighthouse Audit
```bash
# Avec Chrome DevTools
F12 → Lighthouse → Generate report

# En ligne de commande
npx lighthouse http://localhost:5173 --view
```

**Scores cibles** : Performance, Accessibility, Best Practices, SEO > 90

## 📱 Installation PWA

### Développement
La PWA est activée même en développement grâce à `vite-plugin-pwa`.

### Production
Assurez-vous d'avoir :
- ✅ HTTPS activé
- ✅ Tous les assets accessibles
- ✅ Service Worker sur le root
- ✅ Headers de cache appropriés

## 🎯 Bonnes Pratiques

### Performance
- Code splitting automatique
- Lazy loading des routes
- Assets optimisés et compressés
- Cache intelligent (Network First + Cache First)

### Accessibilité
- ARIA labels sur les éléments interactifs
- Navigation au clavier complète
- Contraste WCAG AA
- Focus visible

### Mobile
- Touch targets ≥ 44x44px
- Pas de zoom horizontal
- Gestures tactiles optimisées
- Safe areas pour iPhone X+

## 🌐 Support Navigateurs

| Navigateur | Version | Support |
|------------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |

## 📚 Documentation

- [Guide PWA](./PWA-README.md) - Documentation complète de la PWA
- [Guide de démarrage](./GUIDE-PWA.md) - Installation et configuration
- [Checklist](./PWA-CHECKLIST.md) - Vérification de la PWA
- [Guide visuel](./VISUAL-GUIDE.md) - Design et UX
- [Résumé](./PWA-SUMMARY.md) - Modifications et fichiers

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- Développeur principal - [@dylserker](https://github.com/dylserker)

---

**Made with ❤️ for productivity**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
