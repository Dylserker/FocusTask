import pool from '../config/database';
import type { Settings } from '../types';

export class SettingsService {
  async getSettings(userId: number): Promise<Settings | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Settings WHERE user_id = ?',
      [userId]
    );
    return (rows as Settings[])[0] || null;
  }

  async updateSettings(userId: number, data: Partial<Settings>): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'user_id' && key !== 'created_at') {
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
  }

  async createDefaultSettings(userId: number): Promise<void> {
    await pool.query(
      'INSERT INTO Settings (user_id) VALUES (?)',
      [userId]
    );
  }
}

export default new SettingsService();
