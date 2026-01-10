# 🎯 FocusTask

Application de gestion de tâches gamifiée avec système de niveaux, achievements et récompenses.

## 📋 Description

FocusTask est une application full-stack qui transforme la gestion de tâches en une expérience ludique. Gagnez de l'expérience en complétant vos tâches, déverrouillez des achievements et réclamez des récompenses !

### Fonctionnalités

- ✅ **Gestion de Tâches** - Créez, modifiez, supprimez et complétez vos tâches
- 🎮 **Système de Gamification** - Niveaux, expérience et progression
- 🏆 **Achievements** - Débloquez des achievements en accomplissant des objectifs
- 🎁 **Récompenses** - Réclamez des récompenses avec votre expérience
- 📊 **Statistiques** - Suivez votre progression et vos performances
- 🔐 **Authentification** - Système sécurisé avec JWT
- ⚙️ **Paramètres** - Personnalisez votre expérience

## 🛠️ Technologies

### Backend
- **Express.js** - Framework web Node.js
- **TypeScript** - JavaScript typé
- **MySQL** - Base de données relationnelle
- **JWT** - JSON Web Tokens pour l'authentification
- **Bcrypt** - Hachage de mots de passe

### Frontend
- **React 19** - Bibliothèque UI
- **TypeScript** - JavaScript typé
- **Vite** - Build tool ultra-rapide
- **React Router** - Routing côté client
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

## 🚀 Démarrage Rapide

### Prérequis

- Node.js >= 18
- MySQL >= 8
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd FocusTask
```

2. **Configuration Backend**
```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos informations
```

3. **Configuration Base de Données**
```bash
mysql -u root -p
CREATE DATABASE focustask;
USE focustask;
source database/FocusTask.sql;
exit;
```

4. **Configuration Frontend**
```bash
cd frontend
npm install
cp .env.example .env
```

5. **Démarrer les serveurs**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

6. **Accéder à l'application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📚 Documentation

- [📖 Guide de Démarrage](SETUP.md) - Installation et configuration détaillées
- [🔌 Intégration API](INTEGRATION.md) - Architecture et utilisation des services
- [📝 Résumé](SUMMARY.md) - Vue d'ensemble de l'implémentation
- [⌨️ Commandes](COMMANDS.md) - Commandes utiles pour le développement

## 📁 Structure du Projet

```
FocusTask/
├── backend/                    # API Express.js + TypeScript
│   ├── src/
│   │   ├── config/            # Configuration (database, etc.)
│   │   ├── controllers/       # Logique métier
│   │   ├── middleware/        # Middlewares Express
│   │   ├── routes/            # Routes API
│   │   ├── services/          # Services métier
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Utilitaires
│   │   └── index.ts           # Point d'entrée
│   ├── .env.example           # Variables d'environnement exemple
│   └── package.json
│
├── frontend/                   # Application React + TypeScript
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Composants React réutilisables
│   │   ├── context/           # Contextes React (Auth, etc.)
│   │   ├── examples/          # Exemples d'utilisation
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── pages/             # Pages de l'application
│   │   ├── router/            # Configuration du routing
│   │   ├── services/          # Services API
│   │   ├── App.tsx            # Composant racine
│   │   └── main.tsx           # Point d'entrée
│   ├── .env.example           # Variables d'environnement exemple
│   ├── vite.config.ts         # Configuration Vite
│   └── package.json
│
├── database/                   # Scripts SQL
│   └── FocusTask.sql          # Schéma de la base de données
│
├── shared/                     # Code partagé
│   └── types.ts               # Types TypeScript partagés
│
├── SETUP.md                    # Guide de démarrage
├── INTEGRATION.md              # Documentation API
├── SUMMARY.md                  # Résumé implémentation
├── COMMANDS.md                 # Commandes utiles
└── README.md                   # Ce fichier
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Tâches
- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `GET /api/tasks/:id` - Détails d'une tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `PATCH /api/tasks/:id/complete` - Marquer comme complétée

### Achievements
- `GET /api/achievements` - Liste des achievements
- `GET /api/achievements/user` - Achievements débloqués
- `POST /api/achievements/check` - Vérifier les achievements

### Récompenses
- `GET /api/rewards` - Liste des récompenses
- `GET /api/rewards/user` - Récompenses réclamées
- `POST /api/rewards/:id/redeem` - Réclamer une récompense

### Utilisateur
- `GET /api/users/profile` - Profil
- `PUT /api/users/profile` - Modifier le profil
- `GET /api/users/stats` - Statistiques

### Paramètres
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Modifier les paramètres

## 🎨 Exemples d'Utilisation

### Créer une tâche
```tsx
import { taskService } from './services';

const createTask = async () => {
  const task = await taskService.createTask({
    title: 'Ma nouvelle tâche',
    description: 'Description de la tâche',
    priority: 'high',
    dueDate: '2026-01-15',
  });
  console.log('Tâche créée:', task);
};
```

### Connexion utilisateur
```tsx
import { useAuth } from './context/AuthContext';

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login('user@example.com', 'password123');
    // Redirection automatique après connexion
  };
}
```

### Utiliser les hooks
```tsx
import { useApi } from './hooks/useApi';
import { taskService } from './services';

function TasksList() {
  const { data, loading, error, execute } = useApi();

  useEffect(() => {
    execute(() => taskService.getAllTasks());
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return <div>{/* Afficher les tâches */}</div>;
}
```

Plus d'exemples dans [`frontend/src/examples/ApiUsageExamples.tsx`](frontend/src/examples/ApiUsageExamples.tsx)

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Authentification JWT sécurisée
- ✅ CORS configuré avec whitelist
- ✅ Variables sensibles dans .env (non commitées)
- ✅ Validation des données
- ✅ Protection contre les injections SQL (prepared statements)

## 🧪 Tests (À venir)

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Roadmap

- [ ] Tests unitaires et d'intégration
- [ ] Système de notifications en temps réel
- [ ] Mode hors ligne (PWA)
- [ ] Export des données
- [ ] Thèmes personnalisables
- [ ] Intégration avec calendrier
- [ ] Application mobile (React Native)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 License

MIT

## 👨‍💻 Auteur

Votre Nom

## 🙏 Remerciements

- Express.js team
- React team
- Vite team
- La communauté open source

---

**Fait avec ❤️ et TypeScript**
