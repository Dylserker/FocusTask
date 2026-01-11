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

  async getUserAchievements(userId: number): Promise<{ achievement_id: number }[]> {
    const [rows] = await pool.query(
      `SELECT ua.achievement_id FROM UserAchievements ua
       WHERE ua.user_id = ? 
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );
    return rows as { achievement_id: number }[];
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

  async checkAndUnlockAchievements(userId: number): Promise<Achievement[]> {
    // Appeler la procédure stockée pour vérifier et débloquer les succès
    await pool.query('CALL CheckAchievements(?)', [userId]);

    // Récupérer les succès nouvellement débloqués
    const [rows] = await pool.query(
      `SELECT a.* FROM Achievements a
       JOIN UserAchievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );
    return rows as Achievement[];
  }

  async getNewlyUnlockedAchievements(userId: number): Promise<Achievement[]> {
    // Récupérer les succès débloqués dans les dernières 24 heures
    const [rows] = await pool.query(
      `SELECT a.* FROM Achievements a
       JOIN UserAchievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       AND ua.unlocked_at >= NOW() - INTERVAL 1 DAY
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );
    return rows as Achievement[];
  }

  async unlockMissingAchievements(userId: number): Promise<{
    newlyUnlocked: Achievement[];
    totalUnlocked: number;
  }> {
    // Appeler la procédure stockée pour débloquer les succès manquants
    await pool.query('CALL UnlockMissingAchievements(?)', [userId]);

    // Récupérer les succès nouvellement débloqués (créés depuis moins de 10 secondes)
    const [rows] = await pool.query(
      `SELECT a.* FROM Achievements a
       JOIN UserAchievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       AND ua.unlocked_at >= NOW() - INTERVAL 10 SECOND
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );

    // Récupérer le nombre total de succès débloqués
    const [totalRows] = await pool.query(
      'SELECT COUNT(*) as count FROM UserAchievements WHERE user_id = ?',
      [userId]
    );

    return {
      newlyUnlocked: rows as Achievement[],
      totalUnlocked: ((totalRows as any[])[0])?.count || 0,
    };
  }
}

export default new AchievementService();
