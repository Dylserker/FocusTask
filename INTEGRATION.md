# Intégration Backend-Frontend - FocusTask

## Architecture de l'API

### Backend (Express.js + TypeScript)

**Configuration CORS sécurisée:**
- Whitelist d'origines configurée via variable d'environnement
- Support des credentials (cookies, tokens JWT)
- Headers autorisés: Content-Type, Authorization

**Routes API:**
- `/api/auth` - Authentification (login, register)
- `/api/users` - Gestion utilisateur
- `/api/tasks` - Gestion des tâches
- `/api/achievements` - Gestion des achievements
- `/api/rewards` - Gestion des récompenses
- `/api/settings` - Paramètres utilisateur

### Frontend (React + TypeScript + Vite)

**Configuration:**
- Proxy Vite pour éviter les problèmes CORS en développement
- Variables d'environnement avec `VITE_API_URL`
- Instance axios centralisée avec intercepteurs

## Structure des Services

```
frontend/src/
├── services/
│   ├── api.ts              # Configuration axios + intercepteurs
│   ├── authService.ts      # Service d'authentification
│   ├── taskService.ts      # Service de gestion des tâches
│   ├── achievementService.ts
│   ├── rewardService.ts
│   ├── userService.ts
│   ├── settingsService.ts
│   └── index.ts            # Export centralisé
├── hooks/
│   ├── useApi.ts           # Hooks pour appels API
│   └── index.ts
└── context/
    └── AuthContext.tsx     # Contexte d'authentification intégré
```

## Utilisation

### 1. Configuration des Variables d'Environnement

**Backend (.env):**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=focustask
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Démarrage des Serveurs

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Exemples d'Utilisation dans les Composants

#### Authentification avec AuthContext

```tsx
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, loading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirection automatique après connexion
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

#### Utilisation des Services avec useApi

```tsx
import { useApi } from '../hooks/useApi';
import { taskService } from '../services/taskService';

function TasksComponent() {
  const { data, loading, error, execute } = useApi();

  useEffect(() => {
    execute(() => taskService.getAllTasks(), {
      onSuccess: (tasks) => console.log('Tâches récupérées:', tasks),
      onError: (error) => console.error('Erreur:', error.message),
    });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return <div>{/* Affichage des tâches */}</div>;
}
```

#### Création d'une Tâche avec useMutation

```tsx
import { useMutation } from '../hooks/useApi';
import { taskService } from '../services/taskService';

function CreateTaskComponent() {
  const { mutate, loading } = useMutation();

  const handleCreateTask = async (taskData) => {
    await mutate(
      (data) => taskService.createTask(data),
      taskData,
      {
        onSuccess: (task) => {
          console.log('Tâche créée:', task);
          // Rafraîchir la liste des tâches
        },
        onError: (error) => {
          alert(`Erreur: ${error.message}`);
        },
      }
    );
  };

  return <form onSubmit={handleCreateTask}>...</form>;
}
```

#### Utilisation Directe des Services

```tsx
import { taskService, achievementService } from '../services';

async function loadUserData() {
  try {
    const tasks = await taskService.getAllTasks({ status: 'completed' });
    const achievements = await achievementService.getUserAchievements();
    
    console.log('Données chargées:', { tasks, achievements });
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

## Bonnes Pratiques Implémentées

### Backend

1. **Sécurité:**
   - Configuration CORS avec whitelist
   - Validation des tokens JWT via intercepteurs
   - Variables d'environnement pour les secrets

2. **Structure:**
   - Séparation des responsabilités (routes, controllers, services)
   - Middleware de gestion d'erreurs centralisé
   - Logging des requêtes

3. **API REST:**
   - Routes cohérentes et prévisibles
   - Réponses standardisées
   - Codes HTTP appropriés

### Frontend

1. **Gestion de l'État:**
   - Context API pour l'authentification
   - Hooks personnalisés pour les appels API
   - Cache local avec localStorage

2. **Gestion des Erreurs:**
   - Intercepteurs axios pour erreurs globales
   - Messages d'erreur utilisateur-friendly
   - Déconnexion automatique sur 401

3. **TypeScript:**
   - Typage strict des données API
   - Interfaces pour toutes les entités
   - Auto-complétion et vérification de types

4. **Performance:**
   - Requêtes optimisées
   - Chargement paresseux des données
   - Gestion du loading state

## Flux d'Authentification

1. L'utilisateur se connecte via le formulaire
2. `authService.login()` envoie les credentials au backend
3. Le backend valide et retourne un token JWT
4. Le token est stocké dans localStorage
5. Les requêtes suivantes incluent automatiquement le token via l'intercepteur axios
6. En cas de 401, l'utilisateur est déconnecté et redirigé

## Gestion des Erreurs

- **401 Unauthorized:** Déconnexion automatique et redirection vers login
- **403 Forbidden:** Accès refusé (log console)
- **404 Not Found:** Ressource non trouvée
- **500 Internal Server Error:** Erreur serveur
- **Network Error:** Problème de connexion au serveur

## Tests

Pour tester la connexion backend-frontend:

1. Démarrez le backend sur `http://localhost:3000`
2. Démarrez le frontend sur `http://localhost:5173`
3. Ouvrez la console du navigateur pour voir les logs du proxy
4. Testez la connexion/inscription
5. Vérifiez que le token est stocké dans localStorage
6. Testez les appels API protégés

## Prochaines Étapes

- [ ] Implémenter les controllers backend manquants
- [ ] Ajouter la validation des données avec class-validator
- [ ] Mettre à jour les composants React pour utiliser les services
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Implémenter le rafraîchissement automatique du token
- [ ] Ajouter un système de notifications toast
