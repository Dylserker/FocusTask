import { Router } from 'express';
import rewardController from '../controllers/reward.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes publiques
router.get('/', async (req, res, next) => {
  try {
    await rewardController.getAllRewards(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes protégées
router.get('/user', authenticate, async (req, res, next) => {
  try {
    await rewardController.getUserRewards(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/available', authenticate, async (req, res, next) => {
  try {
    await rewardController.getAvailableRewards(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/:rewardId/unlock', authenticate, async (req, res, next) => {
  try {
    await rewardController.unlockReward(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
