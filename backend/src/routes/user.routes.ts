import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes protégées
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    await userController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    await userController.changePassword(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/account', authenticate, async (req, res, next) => {
  try {
    await userController.deleteAccount(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes publiques
router.get('/leaderboard', async (req, res, next) => {
  try {
    await userController.getLeaderboard(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    await userController.getPublicProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
