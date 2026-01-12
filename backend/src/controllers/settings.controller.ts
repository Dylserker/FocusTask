import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import settingsService from '../services/settings.service';

export class SettingsController {
  async getSettings(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const settings = await settingsService.getSettings(req.userId);

    if (!settings) {
      throw new AppError(404, 'Paramètres non trouvés');
    }

    res.status(200).json({
      status: 'success',
      data: settings,
    });
  }

  async updateSettings(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const {
      notificationsEnabled,
      emailNotifications,
      soundEffects,
      dailyReminderTime,
      theme,
      language,
      timezone,
      dailyGoal,
    } = req.body;

    const updateData: any = {};

    if (notificationsEnabled !== undefined)
      updateData.notifications_enabled = notificationsEnabled;
    if (emailNotifications !== undefined)
      updateData.email_notifications = emailNotifications;
    if (soundEffects !== undefined)
      updateData.sound_effects = soundEffects;
    if (dailyReminderTime !== undefined)
      updateData.daily_reminder_time = dailyReminderTime;
    if (theme !== undefined) updateData.theme = theme;
    if (language !== undefined) updateData.language = language;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (dailyGoal !== undefined) updateData.daily_goal = dailyGoal;

    // Récupérer les paramètres actuels avant la mise à jour
    const previousSettings = await settingsService.getSettings(req.userId);

    await settingsService.updateSettings(
      req.userId,
      updateData,
      previousSettings
    );

    const settings = await settingsService.getSettings(req.userId);

    res.status(200).json({
      status: 'success',
      message: 'Paramètres mis à jour avec succès',
      data: settings,
    });
  }
}

export default new SettingsController();
