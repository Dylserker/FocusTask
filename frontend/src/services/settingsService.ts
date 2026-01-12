import { api } from './api';

// Types pour les paramètres
export interface UserSettings {
  id: number;
  userId: number;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
  dailyGoal?: number;
  dailyReminderTime?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsData {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  dailyGoal?: number;
  dailyReminderTime?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
}

// Service de gestion des paramètres
export const settingsService = {
  /**
   * Récupération des paramètres de l'utilisateur
   */
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<{ success: boolean; data: UserSettings }>('/settings');
    return response.data;
  },

  /**
   * Mise à jour des paramètres de l'utilisateur
   */
  async updateSettings(data: UpdateSettingsData): Promise<UserSettings> {
    const response = await api.patch<{ success: boolean; data: UserSettings }>('/settings', data);
    return response.data;
  },

  /**
   * Réinitialisation des paramètres par défaut
   */
  async resetSettings(): Promise<UserSettings> {
    const response = await api.post<{ success: boolean; data: UserSettings }>('/settings/reset');
    return response.data;
  },
};

