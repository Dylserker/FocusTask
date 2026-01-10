import pool from '../config/database';
import type { Achievement, UserAchievement } from '../types';

export class AchievementService {
  async getAchievementById(id: number): Promise<Achievement | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Achievements WHERE id = ?',
      [id]
    );
    return (rows as Achievement[])[0] || null;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    const [rows] = await pool.query('SELECT * FROM Achievements');
    return rows as Achievement[];
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const [rows] = await pool.query(
      `SELECT a.* FROM Achievements a 
       JOIN UserAchievements ua ON a.id = ua.achievement_id 
       WHERE ua.user_id = ? 
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );
    return rows as Achievement[];
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<void> {
    const already = await this.hasAchievement(userId, achievementId);
    if (already) return;

    const [achievement] = await pool.query(
      'SELECT * FROM Achievements WHERE id = ?',
      [achievementId]
    );
    const ach = (achievement as Achievement[])[0];

    await pool.query(
      'INSERT INTO UserAchievements (user_id, achievement_id) VALUES (?, ?)',
      [userId, achievementId]
    );

    if (ach?.points_reward) {
      await pool.query(
        'UPDATE Users SET total_points = total_points + ?, experience_points = experience_points + ? WHERE id = ?',
        [ach.points_reward, ach.points_reward, userId]
      );
    }
  }

  async hasAchievement(userId: number, achievementId: number): Promise<boolean> {
    const [rows] = await pool.query(
      'SELECT * FROM UserAchievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId]
    );
    return (rows as any[]).length > 0;
  }

  async getAchievementProgress(
    userId: number
  ): Promise<{ total: number; unlocked: number }> {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM Achievements');
    const [unlocked] = await pool.query(
      'SELECT COUNT(*) as count FROM UserAchievements WHERE user_id = ?',
      [userId]
    );
    return {
      total: ((total as any[])[0])?.count || 0,
      unlocked: ((unlocked as any[])[0])?.count || 0,
    };
  }
}

export default new AchievementService();
