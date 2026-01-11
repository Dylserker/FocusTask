import { Router } from 'express';
import achievementController from '../controllers/achievement.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes publiques
router.get('/', async (req, res, next) => {
  try {
    await achievementController.getAllAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes protégées
router.get('/user', authenticate, async (req, res, next) => {
  try {
    await achievementController.getUserAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/user/progress', authenticate, async (req, res, next) => {
  try {
    await achievementController.getAchievementProgress(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/check', authenticate, async (req, res, next) => {
  try {
    await achievementController.checkAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/user/new', authenticate, async (req, res, next) => {
  try {
    await achievementController.getNewlyUnlockedAchievements(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
