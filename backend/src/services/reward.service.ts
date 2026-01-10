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
      `SELECT r.* FROM Rewards r 
       JOIN UserRewards ur ON r.id = ur.reward_id 
       WHERE ur.user_id = ? 
       ORDER BY ur.unlocked_at DESC`,
      [userId]
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
      `SELECT * FROM Rewards 
       WHERE points_required <= ? 
       AND id NOT IN (SELECT reward_id FROM UserRewards WHERE user_id = ?)
       ORDER BY points_required ASC`,
      [userPoints, userId]
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
}

export default new RewardService();
