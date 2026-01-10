import pool from '../config/database';
import type { Task } from '../types';

export class TaskService {
  async getTaskById(taskId: number): Promise<Task | null> {
    const [rows] = await pool.query(
      'SELECT * FROM Tasks WHERE id = ?',
      [taskId]
    );
    return (rows as Task[])[0] || null;
  }

  async getTasksByUserId(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<Task[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Tasks WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows as Task[];
  }

  async getTasksByUserAndDate(userId: number, date: string): Promise<Task[]> {
    const [rows] = await pool.query(
      'SELECT * FROM Tasks WHERE user_id = ? AND date = ? ORDER BY created_at',
      [userId, date]
    );
    return rows as Task[];
  }

  async createTask(
    userId: number,
    name: string,
    description: string | null,
    difficulty: string,
    date: string
  ): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO Tasks (user_id, name, description, difficulty, date) VALUES (?, ?, ?, ?, ?)',
      [userId, name, description, difficulty, date]
    );
    return (result as any).insertId;
  }

  async updateTask(taskId: number, data: Partial<Task>): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return;

    values.push(taskId);
    await pool.query(
      `UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  async completeTask(taskId: number): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.query(
      'UPDATE Tasks SET completed = true, completed_at = ? WHERE id = ?',
      [now, taskId]
    );
  }

  async deleteTask(taskId: number): Promise<void> {
    await pool.query('DELETE FROM Tasks WHERE id = ?', [taskId]);
  }

  async getTodayTasks(userId: number): Promise<Task[]> {
    const [rows] = await pool.query(
      'SELECT * FROM TodayTasks WHERE id = (SELECT id FROM Tasks WHERE user_id = ?)',
      [userId]
    );
    return rows as Task[];
  }

  async getCompletedTasksCount(userId: number): Promise<number> {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM Tasks WHERE user_id = ? AND completed = true',
      [userId]
    );
    return ((rows as any[])[0])?.count || 0;
  }
}

export default new TaskService();
