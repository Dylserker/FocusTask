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

    const achievements = await achievementService.getUserAchievements(req.userId);
    const progress = await achievementService.getAchievementProgress(req.userId);

    res.status(200).json({
      status: 'success',
      data: {
        achievements,
        progress,
      },
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
}

export default new AchievementController();
