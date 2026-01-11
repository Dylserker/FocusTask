import { api } from './api';
import type { Reward } from '../../../shared/types';

export interface RewardsResponse {
  status: string;
  data: Reward[];
}

export interface RewardStatsResponse {
  status: string;
  data: {
    total: number;
    unlocked: number;
    byCategory: { category: string; total: number; unlocked: number }[];
  };
}

// Service de gestion des récompenses
export const rewardService = {
  /**
   * Récupération de toutes les récompenses disponibles
   */
  async getAllRewards(): Promise<Reward[]> {
    const response = await api.get<RewardsResponse>('/rewards');
    return response.data;
  },

  /**
   * Récupération des récompenses disponibles selon les points de l'utilisateur
   */
  async getAvailableRewards(): Promise<Reward[]> {
    const response = await api.get<RewardsResponse>('/rewards/available');
    return response.data;
  },

  /**
   * Récupération des récompenses débloquées par l'utilisateur
   */
  async getUserRewards(): Promise<Reward[]> {
    const response = await api.get<RewardsResponse>('/rewards/user');
    return response.data;
  },

  /**
   * Récupération des récompenses par catégorie
   */
  async getRewardsByCategory(category: string): Promise<Reward[]> {
    const response = await api.get<RewardsResponse>(`/rewards/category/${category}`);
    return response.data;
  },

  /**
   * Récupération des statistiques de récompenses
   */
  async getRewardStats(): Promise<{
    total: number;
    unlocked: number;
    byCategory: { category: string; total: number; unlocked: number }[];
  }> {
    const response = await api.get<RewardStatsResponse>('/rewards/stats');
    return response.data;
  },

  /**
   * Déblocage d'une récompense
   */
  async unlockReward(rewardId: number): Promise<Reward> {
    const response = await api.post<{ status: string; data: Reward }>(
      `/rewards/${rewardId}/unlock`
    );
    return response.data;
  },

  /**
   * Déblocage automatique des récompenses par points
   */
  async unlockRewardsByPoints(): Promise<void> {
    await api.post('/rewards/unlock-by-points');
  },
};
