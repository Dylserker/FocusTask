# Guide de Démarrage - FocusTask

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd FocusTask
```

### 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env à partir de l'exemple
cp .env.example .env

# Éditer .env avec vos informations
nano .env
```

**Configurer les variables dans .env:**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=focustask
JWT_SECRET=votre_secret_jwt_tres_securise
FRONTEND_URL=http://localhost:5173
```

### 3. Configuration de la Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE focustask;

# Importer le schéma
USE focustask;
source ../database/FocusTask.sql;

# Quitter MySQL
exit;
```

### 4. Configuration du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Le fichier `.env` du frontend devrait contenir:
```env
VITE_API_URL=http://localhost:3000/api
```

## Démarrage

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur backend démarre sur `http://localhost:3000`

### Démarrer le Frontend

Dans un autre terminal:

```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## Vérification de l'Installation

1. Ouvrez votre navigateur sur `http://localhost:5173`
2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir les logs du proxy Vite
4. Testez l'inscription d'un nouvel utilisateur
5. Testez la connexion

## Structure du Projet

```
FocusTask/
├── backend/              # API Express.js + TypeScript
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Services
│   │   ├── middleware/   # Middlewares
│   │   └── index.ts      # Point d'entrée
│   └── .env              # Variables d'environnement (ne pas committer)
│
├── frontend/             # Application React + TypeScript + Vite
│   ├── src/
│   │   ├── services/     # Services API
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── context/      # Contextes React
│   │   ├── pages/        # Pages
│   │   └── components/   # Composants
│   └── .env              # Variables d'environnement (ne pas committer)
│
└── database/             # Scripts SQL
```

## Endpoints API Disponibles

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur courant

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

### Récompenses
- `GET /api/rewards` - Liste des récompenses
- `GET /api/rewards/user` - Récompenses réclamées
- `POST /api/rewards/:id/redeem` - Réclamer une récompense

### Utilisateur
- `GET /api/users/profile` - Profil
- `PUT /api/users/profile` - Modifier le profil
- `GET /api/users/stats` - Statistiques

### Paramètres
- `GET /api/settings` - Paramètres
- `PUT /api/settings` - Modifier les paramètres

## Technologies Utilisées

### Backend
- Express.js - Framework web
- TypeScript - Typage statique
- MySQL2 - Driver MySQL
- JWT - Authentification
- Bcrypt - Hachage de mots de passe
- CORS - Gestion des origines croisées

### Frontend
- React 19 - Framework UI
- TypeScript - Typage statique
- Vite - Build tool
- React Router - Routing
- Axios - Client HTTP
- Context API - Gestion d'état

## Scripts Disponibles

### Backend
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build pour production
npm start        # Démarrage en production
npm run lint     # Vérification TypeScript
```

### Frontend
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build pour production
npm run preview  # Preview du build
npm run lint     # Linter ESLint
```

## Debugging

### Problèmes CORS
Si vous rencontrez des erreurs CORS:
1. Vérifiez que `FRONTEND_URL` dans le backend `.env` correspond à l'URL du frontend
2. Vérifiez que le proxy Vite est bien configuré dans `vite.config.ts`
3. Redémarrez les deux serveurs

### Problèmes de Base de Données
1. Vérifiez que MySQL est démarré: `sudo service mysql status`
2. Vérifiez les credentials dans `.env`
3. Vérifiez que la base de données existe: `SHOW DATABASES;`

### Problèmes d'Authentification
1. Vérifiez que `JWT_SECRET` est défini dans le backend `.env`
2. Videz le localStorage du navigateur
3. Vérifiez les logs de la console

## Documentation Complète

Pour plus de détails sur l'intégration backend-frontend, consultez [INTEGRATION.md](./INTEGRATION.md)

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
