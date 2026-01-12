import { api } from './api';

type Theme = 'light' | 'dark' | 'auto';

// Représentation renvoyée par l'API (snake_case)
interface BackendSettings {
  id: number;
  user_id: number;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sound_effects: boolean;
  daily_reminder_time: string | null;
  theme: Theme;
  language: string;
  timezone: string | null;
  daily_goal: number | null;
  created_at?: string;
  updated_at?: string;
}

// Représentation utilisée dans le front (camelCase)
export interface UserSettings {
  id: number;
  userId: number;
  theme: Theme;
  language: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
  dailyGoal?: number;
  dailyReminderTime?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsData {
  theme?: Theme;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  dailyGoal?: number;
  dailyReminderTime?: string;
  timezone?: string;
}

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  message?: string;
  error?: string;
}

const mapFromBackend = (settings: BackendSettings): UserSettings => ({
  id: settings.id,
  userId: settings.user_id,
  theme: settings.theme ?? 'light',
  language: settings.language ?? 'fr',
  notificationsEnabled: settings.notifications_enabled ?? true,
  emailNotifications: settings.email_notifications ?? false,
  soundEffects: settings.sound_effects ?? true,
  dailyGoal: settings.daily_goal ?? undefined,
  dailyReminderTime: settings.daily_reminder_time ?? undefined,
  timezone: settings.timezone ?? undefined,
  createdAt: settings.created_at,
  updatedAt: settings.updated_at,
});

const ensureSuccess = <T>(response: ApiEnvelope<T>, fallbackMessage: string): T => {
  if (response?.status === 'success' && response.data) {
    return response.data;
  }

  const message = response?.message || response?.error || fallbackMessage;
  throw new Error(message);
};

// Service de gestion des paramètres
export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<ApiEnvelope<BackendSettings>>('/settings');
    const payload = ensureSuccess(response, 'Impossible de récupérer les paramètres');
    return mapFromBackend(payload);
  },

  async updateSettings(data: UpdateSettingsData): Promise<UserSettings> {
    const payload = {
      notificationsEnabled: data.notificationsEnabled,
      emailNotifications: data.emailNotifications,
      soundEffects: data.soundEffects,
      dailyReminderTime: data.dailyReminderTime,
      theme: data.theme,
      language: data.language,
      timezone: data.timezone,
      dailyGoal: data.dailyGoal,
    };

    const response = await api.patch<ApiEnvelope<BackendSettings>>('/settings', payload);
    const updated = ensureSuccess(response, 'Impossible de mettre à jour les paramètres');
    return mapFromBackend(updated);
  },
};

