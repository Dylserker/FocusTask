import pool from '../config/database';
import type { Reward } from '../types';

export class RewardService {
  async getRewardById(id: number): Promise<Reward | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Rewards WHERE id = ?',
      [id]
    );
    return (rows as Reward[])[0] || null;
  }

  async getAllRewards(): Promise<Reward[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Rewards ORDER BY points_required ASC'
    );
    return rows as Reward[];
  }

  async getUserRewards(userId: number): Promise<Reward[]> {
    const [rows] = await pool.query(
      `SELECT r.*, ur.unlocked_at, a.title as achievement_title 
       FROM Rewards r 
       JOIN UserRewards ur ON r.id = ur.reward_id 
       LEFT JOIN Achievements a ON r.achievement_id = a.id
       WHERE ur.user_id = ? 
       ORDER BY ur.unlocked_at DESC`,
      [userId]
    );
    return rows as Reward[];
  }

  async getRewardsByCategory(category: string): Promise<Reward[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Rewards WHERE category = ? ORDER BY points_required ASC',
      [category]
    );
    return rows as Reward[];
  }

  async getAvailableRewards(userId: number): Promise<Reward[]> {
    const [userRows] = await pool.query(
      'SELECT total_points FROM Users WHERE id = ?',
      [userId]
    );
    const userPoints = ((userRows as any[])[0])?.total_points || 0;

    const [rows] = await pool.query(
      `SELECT r.*, 
        CASE WHEN ur.id IS NULL THEN false ELSE true END as unlocked,
        a.title as achievement_title
       FROM Rewards r 
       LEFT JOIN UserRewards ur ON r.id = ur.reward_id AND ur.user_id = ?
       LEFT JOIN Achievements a ON r.achievement_id = a.id
       ORDER BY r.points_required ASC`,
      [userId]
    );
    return rows as Reward[];
  }

  async unlockReward(userId: number, rewardId: number): Promise<void> {
    const already = await this.hasReward(userId, rewardId);
    if (already) return;

    await pool.query(
      'INSERT INTO UserRewards (user_id, reward_id) VALUES (?, ?)',
      [userId, rewardId]
    );
  }

  async hasReward(userId: number, rewardId: number): Promise<boolean> {
    const [rows] = await pool.query(
      'SELECT * FROM UserRewards WHERE user_id = ? AND reward_id = ?',
      [userId, rewardId]
    );
    return (rows as any[]).length > 0;
  }

  async unlockRewardsByPoints(userId: number): Promise<void> {
    await pool.query('CALL UnlockRewardsByPoints(?)', [userId]);
  }

  async getRewardStats(userId: number): Promise<{
    total: number;
    unlocked: number;
    byCategory: { category: string; total: number; unlocked: number }[];
  }> {
    // Total de récompenses
    const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM Rewards');
    const total = ((totalRows as any[])[0])?.count || 0;

    // Récompenses débloquées
    const [unlockedRows] = await pool.query(
      'SELECT COUNT(*) as count FROM UserRewards WHERE user_id = ?',
      [userId]
    );
    const unlocked = ((unlockedRows as any[])[0])?.count || 0;

    // Par catégorie
    const [categoryRows] = await pool.query(
      `SELECT 
        r.category,
        COUNT(r.id) as total,
        COUNT(ur.id) as unlocked
       FROM Rewards r
       LEFT JOIN UserRewards ur ON r.id = ur.reward_id AND ur.user_id = ?
       GROUP BY r.category`,
      [userId]
    );

    return {
      total,
      unlocked,
      byCategory: categoryRows as any[],
    };
  }
}

export default new RewardService();
