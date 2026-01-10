import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import taskService from '../services/task.service';

export class TaskController {
  async getTasks(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const tasks = await taskService.getTasksByUserId(req.userId, limit, offset);

    res.status(200).json({
      status: 'success',
      data: tasks,
      pagination: { limit, offset },
    });
  }

  async getTasksByDate(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { date } = req.params;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new AppError(400, 'Date invalide (format: YYYY-MM-DD)');
    }

    const tasks = await taskService.getTasksByUserAndDate(req.userId, date);

    res.status(200).json({
      status: 'success',
      data: tasks,
    });
  }

  async createTask(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { name, description, difficulty, date } = req.body;

    if (!name || !difficulty || !date) {
      throw new AppError(400, 'name, difficulty et date sont requis');
    }

    if (!['facile', 'moyen', 'difficile'].includes(difficulty)) {
      throw new AppError(400, 'Difficulty invalide');
    }

    const taskId = await taskService.createTask(
      req.userId,
      name,
      description || null,
      difficulty,
      date
    );

    const task = await taskService.getTaskById(taskId);

    res.status(201).json({
      status: 'success',
      message: 'Tâche créée avec succès',
      data: task,
    });
  }

  async updateTask(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { taskId } = req.params;
    const id = parseInt(taskId as string, 10);

    if (isNaN(id)) {
      throw new AppError(400, 'ID tâche invalide');
    }

    const task = await taskService.getTaskById(id);
    if (!task) {
      throw new AppError(404, 'Tâche non trouvée');
    }

    if (task.user_id !== req.userId) {
      throw new AppError(403, 'Accès refusé');
    }

    await taskService.updateTask(id, req.body);

    const updatedTask = await taskService.getTaskById(id);

    res.status(200).json({
      status: 'success',
      message: 'Tâche mise à jour avec succès',
      data: updatedTask,
    });
  }

  async completeTask(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { taskId } = req.params;
    const id = parseInt(taskId as string, 10);

    if (isNaN(id)) {
      throw new AppError(400, 'ID tâche invalide');
    }

    const task = await taskService.getTaskById(id);
    if (!task) {
      throw new AppError(404, 'Tâche non trouvée');
    }

    if (task.user_id !== req.userId) {
      throw new AppError(403, 'Accès refusé');
    }

    if (task.completed) {
      throw new AppError(400, 'Tâche déjà complétée');
    }

    await taskService.completeTask(id);

    const updatedTask = await taskService.getTaskById(id);

    res.status(200).json({
      status: 'success',
      message: 'Tâche complétée avec succès',
      data: updatedTask,
    });
  }

  async deleteTask(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { taskId } = req.params;
    const id = parseInt(taskId as string, 10);

    if (isNaN(id)) {
      throw new AppError(400, 'ID tâche invalide');
    }

    const task = await taskService.getTaskById(id);
    if (!task) {
      throw new AppError(404, 'Tâche non trouvée');
    }

    if (task.user_id !== req.userId) {
      throw new AppError(403, 'Accès refusé');
    }

    await taskService.deleteTask(id);

    res.status(200).json({
      status: 'success',
      message: 'Tâche supprimée avec succès',
    });
  }

  async getTodayTasks(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const today = new Date().toISOString().split('T')[0];
    const tasks = await taskService.getTasksByUserAndDate(req.userId, today);

    res.status(200).json({
      status: 'success',
      data: tasks,
    });
  }
}

export default new TaskController();
