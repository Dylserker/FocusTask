# Configuration Vercel pour FocusTask

## Backend - Variables d'environnement nécessaires

Pour que le backend fonctionne correctement avec GitHub Pages, vous devez configurer les variables d'environnement suivantes sur Vercel :

1. Allez sur https://vercel.com
2. Sélectionnez votre projet backend
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `FRONTEND_URL` | `https://dylserker.github.io` | Origine autorisée pour CORS |
| `NODE_ENV` | `production` | Environnement de production |
| `DB_HOST` | `votre_host_db` | Hôte de la base de données |
| `DB_USER` | `votre_user_db` | Utilisateur de la base de données |
| `DB_PASSWORD` | `votre_password_db` | Mot de passe de la base de données |
| `DB_NAME` | `focustask_db` | Nom de la base de données |
| `JWT_SECRET` | `votre_secret_jwt_securise` | Clé secrète JWT (minimum 32 caractères) |

## Important - CORS

La variable `FRONTEND_URL` est cruciale pour autoriser les requêtes depuis GitHub Pages. Sans cette configuration, vous obtiendrez l'erreur :

```
Access to XMLHttpRequest at 'https://focus-task-pi.vercel.app/api/auth/login' from origin 'https://dylserker.github.io' has been blocked by CORS policy
```

## Redéploiement

Après avoir ajouté les variables d'environnement :

1. Vercel redéploiera automatiquement votre application
2. Attendez que le déploiement soit terminé
3. Testez l'application depuis https://dylserker.github.io/FocusTask

## Vérification

Pour vérifier que les variables sont correctement configurées, consultez les logs Vercel. Vous devriez voir :

```
🔍 CORS Allowed Origins: [ 'https://dylserker.github.io' ]
🔍 NODE_ENV: production
🔍 FRONTEND_URL env var: https://dylserker.github.io
```
