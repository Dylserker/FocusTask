import pool from '../config/database';
import type { Settings } from '../types';
import emailService from './email.service';

export class SettingsService {
  async getSettings(userId: number): Promise<Settings | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Settings WHERE user_id = ?',
      [userId]
    );
    return (rows as Settings[])[0] || null;
  }

  async getUserEmail(userId: number): Promise<{ email: string; username: string } | null> {
    const [rows] = await pool.query(
      'SELECT email, username FROM Users WHERE id = ?',
      [userId]
    );
    const users = rows as Array<{ email: string; username: string }>;
    return users[0] || null;
  }

  async updateSettings(
    userId: number,
    data: Partial<Settings>,
    previousSettings?: Settings | null
  ): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== 'id' &&
        key !== 'user_id' &&
        key !== 'created_at'
      ) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return;

    values.push(userId);
    await pool.query(
      `UPDATE Settings SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // Si les notifications sont modifiées, envoyer un email
    if (
      data.notifications_enabled !== undefined &&
      previousSettings &&
      data.notifications_enabled !== previousSettings.notifications_enabled
    ) {
      try {
        const user = await this.getUserEmail(userId);
        if (user) {
          if (data.notifications_enabled) {
            await emailService.sendNotificationActivationEmail(
              user.email,
              user.username
            );
          } else {
            await emailService.sendNotificationDeactivationEmail(
              user.email,
              user.username
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        // Ne pas faire échouer la mise à jour si l'email échoue
      }
    }
  }

  async createDefaultSettings(userId: number): Promise<void> {
    await pool.query('INSERT INTO Settings (user_id) VALUES (?)', [userId]);
  }
}

export default new SettingsService();
