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
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

const isProduction = process.env.NODE_ENV === 'production';

console.log('🔍 CORS Allowed Origins:', allowedOrigins);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    // En production sans FRONTEND_URL, accepter tout temporairement
    if (isProduction && !process.env.FRONTEND_URL) {
      console.log('⚠️ CORS: No FRONTEND_URL defined, accepting all origins');
      return callback(null, true);
    }
    
    // Permet les requêtes sans origin (comme les apps mobiles ou Postman)
    if (!origin) {
      console.log('✅ CORS: No origin provided');
      return callback(null, true);
    }
    
    console.log('🔍 CORS Check:', { origin, allowed: allowedOrigins });
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin denied:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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

// Export for Vercel serverless
export default app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}
