# FocusTask Backend

Backend API pour FocusTask, construit avec Express.js et TypeScript.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Configurez vos variables d'environnement :
- `PORT` : Port du serveur (défaut: 3000)
- `DB_HOST` : Hôte de la base de données
- `DB_USER` : Utilisateur MySQL
- `DB_PASSWORD` : Mot de passe MySQL
- `DB_NAME` : Nom de la base de données
- `JWT_SECRET` : Clé secrète pour JWT

## Scripts

### Développement
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── config/           # Configuration (database, etc)
├── controllers/      # Logique métier des endpoints
├── middleware/       # Middleware (auth, logging, error handling)
├── routes/          # Définition des routes API
├── services/        # Logique métier réutilisable
├── types/           # Types TypeScript
├── utils/           # Utilitaires
└── index.ts         # Point d'entrée
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir mon profil

### Users
- `GET /api/users/profile` - Mon profil
- `PATCH /api/users/profile` - Mettre à jour mon profil
- `GET /api/users/leaderboard` - Classement global
- `GET /api/users/:userId` - Profil public d'un utilisateur

### Tasks
- `GET /api/tasks` - Mes tâches
- `GET /api/tasks/today` - Tâches d'aujourd'hui
- `GET /api/tasks/:date` - Tâches d'une date spécifique
- `POST /api/tasks` - Créer une tâche
- `PATCH /api/tasks/:taskId` - Mettre à jour une tâche
- `PATCH /api/tasks/:taskId/complete` - Marquer comme complétée
- `DELETE /api/tasks/:taskId` - Supprimer une tâche

### Achievements
- `GET /api/achievements` - Tous les achievements
- `GET /api/achievements/user` - Mes achievements
- `GET /api/achievements/user/progress` - Progression des achievements

### Rewards
- `GET /api/rewards` - Toutes les récompenses
- `GET /api/rewards/user` - Mes récompenses
- `GET /api/rewards/available` - Récompenses disponibles
- `POST /api/rewards/:rewardId/unlock` - Débloquer une récompense

### Settings
- `GET /api/settings` - Mes paramètres
- `PATCH /api/settings` - Mettre à jour mes paramètres

## Authentification

Les routes protégées nécessitent un token JWT dans le header `Authorization`:

```
Authorization: Bearer <token>
```

## Notes

- Les erreurs sont retournées au format JSON standardisé
- Les requêtes utilisent du middleware de validation automatique
- La base de données utilise des triggers MySQL pour les calculs de points
