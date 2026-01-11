import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import rewardService from '../services/reward.service';

export class RewardController {
  async getAllRewards(_req: AuthRequest, res: Response) {
    const rewards = await rewardService.getAllRewards();

    res.status(200).json({
      status: 'success',
      data: rewards,
    });
  }

  async getUserRewards(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const rewards = await rewardService.getUserRewards(req.userId);

    res.status(200).json({
      status: 'success',
      data: rewards,
    });
  }

  async getAvailableRewards(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const rewards = await rewardService.getAvailableRewards(req.userId);

    res.status(200).json({
      status: 'success',
      data: rewards,
    });
  }

  async getRewardsByCategory(req: AuthRequest, res: Response) {
    const { category } = req.params;
    const rewards = await rewardService.getRewardsByCategory(category);

    res.status(200).json({
      status: 'success',
      data: rewards,
    });
  }

  async getRewardStats(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const stats = await rewardService.getRewardStats(req.userId);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  }

  async unlockReward(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { rewardId } = req.params;
    const id = parseInt(rewardId as string, 10);

    if (isNaN(id)) {
      throw new AppError(400, 'ID récompense invalide');
    }

    const reward = await rewardService.getRewardById(id);
    if (!reward) {
      throw new AppError(404, 'Récompense non trouvée');
    }

    const alreadyUnlocked = await rewardService.hasReward(req.userId, id);
    if (alreadyUnlocked) {
      throw new AppError(400, 'Récompense déjà débloquée');
    }

    await rewardService.unlockReward(req.userId, id);

    res.status(200).json({
      status: 'success',
      message: 'Récompense débloquée avec succès',
      data: reward,
    });
  }

  async unlockRewardsByPoints(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    await rewardService.unlockRewardsByPoints(req.userId);

    res.status(200).json({
      status: 'success',
      message: 'Récompenses débloquées automatiquement selon vos points',
    });
  }
}

export default new RewardController();
