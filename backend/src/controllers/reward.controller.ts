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
}

export default new RewardController();
