# 🚀 Guide de Démarrage Rapide - FocusTask

## ⏱️ En 5 minutes

### 1️⃣ Installation (2 min)

```bash
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd frontend
npm install
```

### 2️⃣ Configuration (1 min)

**Backend:**
```bash
cd backend
cp .env.example .env
# Éditer .env: changer DB_PASSWORD
```

**Frontend:**
```bash
cd frontend  
cp .env.example .env
# Pas besoin de modifier si backend sur port 3000
```

### 3️⃣ Base de Données (1 min)

```bash
mysql -u root -p
CREATE DATABASE focustask;
USE focustask;
source database/FocusTask.sql;
exit;
```

### 4️⃣ Démarrer (1 min)

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 5️⃣ Accéder à l'App

Ouvrir: **http://localhost:5173**

---

## 📊 Architecture Visuelle

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                   http://localhost:5173                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐     ┌──────────────┐    ┌─────────────┐ │
│  │   Pages       │────▶│   Context    │───▶│  Services   │ │
│  │ (Login, Tasks)│     │ (AuthContext)│    │ (API calls) │ │
│  └───────────────┘     └──────────────┘    └──────┬──────┘ │
│                                                     │        │
│                                                     │        │
│  ┌───────────────┐     ┌──────────────┐           │        │
│  │  Components   │     │    Hooks     │           │        │
│  │ (Header, Modal)│     │  (useApi)   │           │        │
│  └───────────────┘     └──────────────┘           │        │
│                                                     │        │
└─────────────────────────────────────────────────────┼────────┘
                                                      │
                                    axios + JWT Token │
                                                      │
┌─────────────────────────────────────────────────────┼────────┐
│                      BACKEND (Express)               │        │
│                   http://localhost:3000              │        │
├─────────────────────────────────────────────────────┼────────┤
│                                                      ▼        │
│  ┌────────────┐    ┌─────────────┐    ┌──────────────────┐ │
│  │   Routes   │───▶│ Controllers │───▶│    Services      │ │
│  │ /api/tasks │    │  (Logic)    │    │ (Business Logic) │ │
│  └────────────┘    └─────────────┘    └────────┬─────────┘ │
│                                                  │           │
│  ┌────────────┐    ┌─────────────┐             │           │
│  │ Middleware │    │    Utils    │             │           │
│  │ (Auth, CORS)    │  (Errors)   │             │           │
│  └────────────┘    └─────────────┘             │           │
│                                                  │           │
└──────────────────────────────────────────────────┼───────────┘
                                                   │
                                                   │ SQL
                                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                     DATABASE (MySQL)                          │
│                                                               │
│  ┌────────┐  ┌────────┐  ┌──────────────┐  ┌──────────┐   │
│  │ users  │  │ tasks  │  │ achievements │  │ rewards  │   │
│  └────────┘  └────────┘  └──────────────┘  └──────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données (Exemple: Login)

```
┌─────────────┐
│ 1. User     │  Entre email + password
│    Input    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 2. Login    │  <Login /> Component
│   Component │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 3. useAuth  │  login(email, password)
│    Hook     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 4. Auth     │  authService.login({ email, password })
│   Service   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 5. Axios    │  POST /api/auth/login
│   Request   │  + Interceptor (add headers)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 6. Backend  │  Express route + Controller
│   API       │  Valide credentials
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 7. Database │  SELECT * FROM users WHERE email = ?
│   Query     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 8. Response │  { token: "...", user: {...} }
│   Backend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 9. Axios    │  Interceptor (handle errors)
│   Response  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 10. Auth    │  Store token in localStorage
│    Service  │  Update AuthContext state
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 11. Navigate│  Redirect to /
│    to Home  │
└─────────────┘
```

---

## 🎯 Utilisation dans les Composants

### 🔐 Authentification

```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { login, logout, isAuthenticated, user } = useAuth();
  
  // Login
  await login('email@test.com', 'password');
  
  // Logout
  logout();
  
  // Vérifier auth
  if (isAuthenticated) {
    console.log(user.username);
  }
}
```

### 📝 Créer une Tâche

```tsx
import { taskService } from './services';

async function createTask() {
  const task = await taskService.createTask({
    title: 'Ma tâche',
    priority: 'high',
    description: 'Description',
  });
}
```

### 📊 Lister les Tâches

```tsx
import { useApi } from './hooks';
import { taskService } from './services';

function TasksList() {
  const { data, loading, execute } = useApi();
  
  useEffect(() => {
    execute(() => taskService.getAllTasks());
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{data?.map(task => ...)}</div>;
}
```

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `backend/src/index.ts` | Point d'entrée backend |
| `frontend/src/main.tsx` | Point d'entrée frontend |
| `frontend/src/services/api.ts` | Config axios |
| `frontend/src/context/AuthContext.tsx` | Auth state |
| `backend/.env` | Config backend |
| `frontend/.env` | Config frontend |

---

## ⚡ Commandes Essentielles

```bash
# Démarrer backend
cd backend && npm run dev

# Démarrer frontend
cd frontend && npm run dev

# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Vérifier l'installation
bash check-installation.sh
```

---

## 🆘 Aide Rapide

### Port déjà utilisé?
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Problème MySQL?
```bash
# Démarrer MySQL
sudo service mysql start

# Vérifier
mysql -u root -p
```

### Erreur CORS?
```bash
# Vérifier FRONTEND_URL dans backend/.env
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Documentation Complète

- 📖 [README.md](README.md) - Vue d'ensemble
- 🛠️ [SETUP.md](SETUP.md) - Installation détaillée
- 🔌 [INTEGRATION.md](INTEGRATION.md) - Architecture API
- 📝 [SUMMARY.md](SUMMARY.md) - Récapitulatif
- ⌨️ [COMMANDS.md](COMMANDS.md) - Toutes les commandes

---

**🎉 Bon développement !**
