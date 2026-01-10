import pool from '../config/database';
import type { User } from '../types';
import bcrypt from 'bcrypt';

export class UserService {
  async getUserById(userId: number): Promise<User | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Users WHERE id = ?',
      [userId]
    );
    return (rows as User[])[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return (rows as User[])[0] || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    return (rows as User[])[0] || null;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<number> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO Users (username, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, firstName || null, lastName || null]
    );
    return (result as any).insertId;
  }

  async updateUser(userId: number, data: Partial<User>): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return;

    values.push(userId);
    await pool.query(
      `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  async getStats(userId: number) {
    const [rows] = await pool.query(
      'SELECT * FROM UserStats WHERE id = ?',
      [userId]
    );
    return (rows as any[])[0] || null;
  }

  async getAllUsers(limit: number = 10, offset: number = 0): Promise<User[]> {
    const [rows] = await pool.query(
      'SELECT id, username, email, first_name, last_name, photo_url, level, experience_points, tasks_completed, current_streak, total_points, created_at FROM Users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows as User[];
  }

  async deleteUser(userId: number): Promise<void> {
    await pool.query('DELETE FROM Users WHERE id = ?', [userId]);
  }
}

export default new UserService();
