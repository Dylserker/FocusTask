# 📋 Commandes Utiles - FocusTask

## 🚀 Démarrage Rapide

### Première Installation
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos informations
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

### Démarrage Quotidien
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 📦 NPM Scripts

### Backend
```bash
# Développement avec hot-reload
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start

# Vérification TypeScript
npm run lint
```

### Frontend
```bash
# Développement avec hot-reload
npm run dev

# Build pour production
npm run build

# Preview du build de production
npm run preview

# Linting ESLint
npm run lint
```

## 🗄️ Base de Données MySQL

### Connexion
```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la base de données
USE focustask;

# Lister les tables
SHOW TABLES;

# Voir la structure d'une table
DESCRIBE users;
```

### Import/Export
```bash
# Importer le schéma
mysql -u root -p focustask < database/FocusTask.sql

# Exporter la base de données
mysqldump -u root -p focustask > backup.sql

# Exporter seulement la structure (sans données)
mysqldump -u root -p --no-data focustask > schema.sql
```

### Requêtes Utiles
```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Voir les tâches d'un utilisateur
SELECT * FROM tasks WHERE userId = 1;

-- Compter les tâches par statut
SELECT status, COUNT(*) as count FROM tasks GROUP BY status;

-- Voir les achievements débloqués
SELECT u.username, a.title, ua.unlockedAt
FROM user_achievements ua
JOIN users u ON ua.userId = u.id
JOIN achievements a ON ua.achievementId = a.id;

-- Supprimer toutes les données (ATTENTION!)
TRUNCATE TABLE user_achievements;
TRUNCATE TABLE user_rewards;
TRUNCATE TABLE tasks;
TRUNCATE TABLE users;
```

## 🔍 Debugging

### Vérifier que les serveurs tournent
```bash
# Backend
curl http://localhost:3000/api/health

# Frontend
curl http://localhost:5173
```

### Logs en temps réel
```bash
# Backend (les logs s'affichent automatiquement dans le terminal)
# Voir les logs de requêtes grâce au middleware requestLogger

# Frontend (ouvrir la console du navigateur F12)
# Les logs du proxy Vite s'affichent dans le terminal
```

### Tester les endpoints avec curl
```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get tasks (avec token)
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🧹 Nettoyage

### Nettoyer les dépendances
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Nettoyer les builds
```bash
# Backend
cd backend
rm -rf dist

# Frontend
cd frontend
rm -rf dist
```

### Nettoyer le cache
```bash
# Frontend - Nettoyer le cache Vite
cd frontend
rm -rf node_modules/.vite
```

## 🔧 Git

### Initialiser un repo
```bash
git init
git add .
git commit -m "Initial commit - Backend + Frontend integration"
```

### Vérifier les fichiers ignorés
```bash
# Voir ce qui est ignoré
git status --ignored

# Vérifier que .env n'est pas tracké
git ls-files | grep .env
# (ne devrait rien retourner)
```

### Commits recommandés
```bash
git add backend/
git commit -m "feat(backend): configure CORS and environment variables"

git add frontend/src/services/
git commit -m "feat(frontend): add API services layer"

git add frontend/src/hooks/
git commit -m "feat(frontend): add custom API hooks"

git add frontend/src/context/
git commit -m "feat(frontend): integrate real authentication with backend"
```

## 🐛 Résolution de Problèmes

### Port déjà utilisé
```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000

# Tuer le processus
kill -9 PID

# Ou utiliser un autre port dans .env
PORT=3001
```

### Problèmes CORS
```bash
# Vérifier que FRONTEND_URL est correct dans backend/.env
FRONTEND_URL=http://localhost:5173

# Redémarrer le backend
```

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL tourne
sudo service mysql status

# Démarrer MySQL
sudo service mysql start

# Vérifier les credentials dans backend/.env
```

### Module non trouvé
```bash
# Réinstaller les dépendances
npm ci

# Ou
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Vérifier les erreurs
npm run lint

# Rebuild
npm run build
```

## 📊 Monitoring

### Voir les processus actifs
```bash
# Processus Node.js
ps aux | grep node

# Processus npm
ps aux | grep npm
```

### Utilisation des ports
```bash
# Voir tous les ports en écoute
netstat -tuln | grep LISTEN

# Ou avec ss
ss -tuln | grep LISTEN
```

## 🧪 Tests (à implémenter)

### Backend
```bash
# Installer jest
npm install --save-dev jest @types/jest ts-jest

# Lancer les tests
npm test

# Coverage
npm run test:coverage
```

### Frontend
```bash
# Installer testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Lancer les tests
npm test
```

## 🚢 Production

### Build pour production
```bash
# Backend
cd backend
npm run build
# Les fichiers compilés sont dans dist/

# Frontend
cd frontend
npm run build
# Les fichiers sont dans dist/
```

### Démarrer en production
```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend (servir les fichiers statiques)
cd frontend
npm run preview
# Ou utiliser un serveur web comme nginx
```

## 📝 Variables d'Environnement

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=focustask
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=10
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🔗 URLs Utiles

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health
- Login: http://localhost:5173/login
- Register: http://localhost:5173/register

## 📚 Documentation

- [SETUP.md](SETUP.md) - Guide de démarrage
- [INTEGRATION.md](INTEGRATION.md) - Architecture et utilisation
- [SUMMARY.md](SUMMARY.md) - Résumé de l'implémentation
- [shared/types.ts](shared/types.ts) - Types TypeScript

---

**💡 Tip:** Gardez ces commandes à portée de main pendant le développement !
