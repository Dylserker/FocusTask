import { Router } from 'express';
import settingsController from '../controllers/settings.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes protégées
router.get('/', authenticate, async (req, res, next) => {
  try {
    await settingsController.getSettings(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/', authenticate, async (req, res, next) => {
  try {
    await settingsController.updateSettings(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
