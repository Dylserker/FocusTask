import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import achievementService from '../services/achievement.service';

export class AchievementController {
  async getAllAchievements(_req: AuthRequest, res: Response) {
    const achievements = await achievementService.getAllAchievements();

    res.status(200).json({
      status: 'success',
      data: achievements,
    });
  }

  async getUserAchievements(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const userAchievementIds = await achievementService.getUserAchievements(req.userId);

    res.status(200).json({
      status: 'success',
      data: userAchievementIds,
    });
  }

  async getAchievementProgress(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const progress = await achievementService.getAchievementProgress(req.userId);

    res.status(200).json({
      status: 'success',
      data: progress,
    });
  }

  async checkAchievements(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const achievements = await achievementService.checkAndUnlockAchievements(req.userId);

    res.status(200).json({
      status: 'success',
      message: 'Vérification des succès effectuée',
      data: achievements,
    });
  }

  async getNewlyUnlockedAchievements(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const achievements = await achievementService.getNewlyUnlockedAchievements(req.userId);

    res.status(200).json({
      status: 'success',
      data: achievements,
    });
  }

  async unlockMissingAchievements(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const result = await achievementService.unlockMissingAchievements(req.userId);

    res.status(200).json({
      status: 'success',
      message: `${result.newlyUnlocked.length} nouveau(x) succès débloqué(s)`,
      data: {
        newlyUnlocked: result.newlyUnlocked,
        totalUnlocked: result.totalUnlocked,
      },
    });
  }
}

export default new AchievementController();
