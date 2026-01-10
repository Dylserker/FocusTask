import { api } from './api';

// Types pour les récompenses
export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number; // Coût en points d'expérience
  icon?: string;
  category?: string;
  isAvailable: boolean;
  createdAt?: string;
}

export interface UserReward {
  id: number;
  userId: number;
  rewardId: number;
  redeemedAt: string;
  reward?: Reward;
}

export interface RewardsResponse {
  success: boolean;
  data: Reward[];
}

export interface UserRewardsResponse {
  success: boolean;
  data: UserReward[];
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
   * Récupération des récompenses réclamées par l'utilisateur
   */
  async getUserRewards(): Promise<UserReward[]> {
    const response = await api.get<UserRewardsResponse>('/rewards/user');
    return response.data;
  },

  /**
   * Récupération d'une récompense par son ID
   */
  async getRewardById(rewardId: number): Promise<Reward> {
    const response = await api.get<{ success: boolean; data: Reward }>(
      `/rewards/${rewardId}`
    );
    return response.data;
  },

  /**
   * Réclamation d'une récompense
   */
  async redeemReward(rewardId: number): Promise<UserReward> {
    const response = await api.post<{ success: boolean; data: UserReward }>(
      `/rewards/${rewardId}/redeem`
    );
    return response.data;
  },

  /**
   * Vérification si l'utilisateur peut réclamer une récompense
   */
  async canRedeemReward(rewardId: number): Promise<{
    canRedeem: boolean;
    reason?: string;
    currentExperience: number;
    requiredExperience: number;
  }> {
    const response = await api.get(`/rewards/${rewardId}/can-redeem`);
    return response.data;
  },
};
