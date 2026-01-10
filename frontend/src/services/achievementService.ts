import { api } from './api';

// Types pour les achievements
export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  icon?: string;
  experienceReward: number;
  condition: string;
  conditionValue: number;
  createdAt?: string;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  unlockedAt: string;
  achievement?: Achievement;
}

export interface AchievementsResponse {
  success: boolean;
  data: Achievement[];
}

export interface UserAchievementsResponse {
  success: boolean;
  data: UserAchievement[];
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
  async getUserAchievements(): Promise<UserAchievement[]> {
    const response = await api.get<UserAchievementsResponse>('/achievements/user');
    return response.data;
  },

  /**
   * Récupération d'un achievement par son ID
   */
  async getAchievementById(achievementId: number): Promise<Achievement> {
    const response = await api.get<{ success: boolean; data: Achievement }>(
      `/achievements/${achievementId}`
    );
    return response.data;
  },

  /**
   * Vérification des achievements et déblocage automatique
   */
  async checkAchievements(): Promise<UserAchievement[]> {
    const response = await api.post<UserAchievementsResponse>('/achievements/check');
    return response.data;
  },

  /**
   * Récupération de la progression vers un achievement
   */
  async getAchievementProgress(achievementId: number): Promise<{
    current: number;
    target: number;
    percentage: number;
  }> {
    const response = await api.get(`/achievements/${achievementId}/progress`);
    return response.data;
  },
};
