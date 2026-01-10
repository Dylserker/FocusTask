import { api } from './api';

// Types pour l'utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  joinDate?: string;
  level: number;
  experiencePoints?: number;
  experiencePercent?: number;
  tasksCompleted?: number;
  currentStreak?: number;
  totalPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalAchievements: number;
  unlockedAchievements: number;
  totalRewards: number;
  redeemedRewards: number;
  currentStreak: number;
  longestStreak: number;
}

// Service de gestion de l'utilisateur
export const userService = {
  /**
   * Récupération du profil utilisateur
   */
  async getProfile(): Promise<User> {
    const response = await api.get<{ status: string; data: User }>('/users/profile');
    return response.data;
  },

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await api.patch<{ status: string; data: User }>('/users/profile', data);
    
    // Mettre à jour les données stockées localement
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },

  /**
   * Changement de mot de passe
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.post('/users/change-password', data);
  },

  /**
   * Récupération des statistiques de l'utilisateur
   */
  async getStats(): Promise<UserStats> {
    const response = await api.get<{ status: string; data: UserStats }>('/users/stats');
    return response.data;
  },

  /**
   * Suppression du compte utilisateur
   */
  async deleteAccount(): Promise<void> {
    await api.delete('/users/account');
    // Nettoyer les données locales
    localStorage.clear();
  },

  /**
   * Calcul du pourcentage d'expérience pour le niveau actuel
   */
  calculateExperiencePercent(experience: number, level: number): number {
    // Formule: expérience nécessaire = niveau * 100
    const experienceForCurrentLevel = (level - 1) * 100;
    const experienceForNextLevel = level * 100;
    const experienceInCurrentLevel = experience - experienceForCurrentLevel;
    const experienceNeededForLevel = experienceForNextLevel - experienceForCurrentLevel;
    
    return Math.min(100, Math.round((experienceInCurrentLevel / experienceNeededForLevel) * 100));
  },
};
