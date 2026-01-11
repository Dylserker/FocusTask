import { api } from './api';

// Types pour les achievements
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  points_reward: number;
  created_at?: string;
}

export interface UserAchievementData {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: string;
}

export interface AchievementsResponse {
  status: string;
  data: Achievement[];
}

export interface UserAchievementsResponse {
  status: string;
  data: UserAchievementData[];
}

export interface AchievementProgressResponse {
  status: string;
  data: {
    total: number;
    unlocked: number;
  };
}

// Service de gestion des achievements
export const achievementService = {
  /**
   * Récupération de tous les achievements disponibles
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const response = await api.get<AchievementsResponse>('/achievements');
    return response.data;
  },

  /**
   * Récupération des achievements débloqués par l'utilisateur
   */
  async getUserAchievements(): Promise<UserAchievementData[]> {
    const response = await api.get<UserAchievementsResponse>('/achievements/user');
    return response.data;
  },

  /**
   * Récupération de la progression de l'utilisateur
   */
  async getAchievementProgress(): Promise<{
    total: number;
    unlocked: number;
  }> {
    const response = await api.get<AchievementProgressResponse>('/achievements/user/progress');
    return response.data;
  },

  /**
   * Récupération d'un achievement par son ID
   */
  async getAchievementById(achievementId: number): Promise<Achievement> {
    const response = await api.get<{ status: string; data: Achievement }>(
      `/achievements/${achievementId}`
    );
    return response.data;
  },

  /**
   * Vérifier et débloquer les achievements automatiquement
   */
  async checkAchievements(): Promise<Achievement[]> {
    const response = await api.post<AchievementsResponse>('/achievements/check');
    return response.data;
  },

  /**
   * Récupérer les achievements débloqués récemment (24h)
   */
  async getNewlyUnlockedAchievements(): Promise<Achievement[]> {
    const response = await api.get<AchievementsResponse>('/achievements/user/new');
    return response.data;
  },
  
  /**
   * Débloquer tous les succès manquants (rétroactivement)
   */
  async unlockMissingAchievements(): Promise<{
    newlyUnlocked: Achievement[];
    totalUnlocked: number;
  }> {
    const response = await api.post<{
      status: string;
      message: string;
      data: {
        newlyUnlocked: Achievement[];
        totalUnlocked: number;
      };
    }>('/achievements/unlock-missing');
    return response.data;
  },
  
};
