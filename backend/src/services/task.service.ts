import pool from '../config/database';
import type { Task } from '../types';

export class TaskService {
  /**
   * Formater une tâche pour l'API en incluant le status
   * La date est déjà au format YYYY-MM-DD grâce au DATE_FORMAT en SQL
   */
  private formatTask(task: any): any {
    // Assurer que la date reste au format string YYYY-MM-DD
    let dateStr = task.date;
    if (typeof dateStr !== 'string') {
      dateStr = String(dateStr);
    }
    
    return {
      ...task,
      date: dateStr,
      status: task.status || (task.completed ? 'completed' : 'pending'),
    };
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    const [rows] = await pool.query(
      `SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as date FROM Tasks WHERE id = ? AND deleted_at IS NULL`,
      [taskId]
    );
    const task = (rows as Task[])[0] || null;
    return task ? this.formatTask(task) : null;
  }

  async getTasksByUserId(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<Task[]> {
    const [rows] = await pool.query(
      `SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as date FROM Tasks WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return (rows as Task[]).map(task => this.formatTask(task));
  }

  async getTasksByUserAndDate(userId: number, date: string): Promise<Task[]> {
    const [rows] = await pool.query(
      `SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as date FROM Tasks WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY created_at`,
      [userId, date]
    );
    return (rows as Task[]).map(task => this.formatTask(task));
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

    // Colonnes valides qu'on peut updater
    const validColumns = ['name', 'description', 'difficulty', 'date', 'completed', 'status'];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && validColumns.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return;

    values.push(taskId);
    const query = `UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    try {
      await pool.query(query, values);
    } catch (error: any) {
      // Si erreur "colonne inconnue" pour status, retry sans status
      if (error.code === 'ER_BAD_FIELD_ERROR' && updates.some(u => u.includes('status'))) {
        const updatesWithoutStatus = updates.filter(u => !u.includes('status'));
        const valuesWithoutStatus = values.slice(0, -values.length + updatesWithoutStatus.length);
        valuesWithoutStatus.push(taskId);
        
        if (updatesWithoutStatus.length > 0) {
          await pool.query(
            `UPDATE Tasks SET ${updatesWithoutStatus.join(', ')} WHERE id = ?`,
            valuesWithoutStatus
          );
        }
      } else {
        throw error;
      }
    }
  }

  async completeTask(taskId: number): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.query(
      'UPDATE Tasks SET completed = true, completed_at = ? WHERE id = ?',
      [now, taskId]
    );
  }

  async deleteTask(taskId: number): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.query('UPDATE Tasks SET deleted_at = ? WHERE id = ?', [now, taskId]);
  }

  async getTodayTasks(userId: number): Promise<Task[]> {
    const [rows] = await pool.query(
      `SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as date FROM Tasks WHERE user_id = ? AND DATE(date) = CURDATE() AND deleted_at IS NULL`,
      [userId]
    );
    return (rows as Task[]).map(task => this.formatTask(task));
  }

  async getCompletedTasksCount(userId: number): Promise<number> {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM Tasks WHERE user_id = ? AND completed = true AND deleted_at IS NULL',
      [userId]
    );
    return ((rows as any[])[0])?.count || 0;
  }
}

export default new TaskService();
