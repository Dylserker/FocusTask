import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { initializeDatabase } from './config/database-init';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import achievementRoutes from './routes/achievement.routes';
import rewardRoutes from './routes/reward.routes';
import settingsRoutes from './routes/settings.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialiser la base de données au démarrage
initializeDatabase().catch((error) => {
  console.error('Erreur lors de l\'initialisation de la base de données:', error);
  process.exit(1);
});

// Configuration CORS sécurisée
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permet les requêtes sans origin (comme les apps mobiles ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permet l'envoi de cookies et d'en-têtes d'authentification
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
