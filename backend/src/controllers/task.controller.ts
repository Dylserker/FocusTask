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

    // Support à la fois les anciens champs (name, difficulty, date) et les nouveaux (title, priority, dueDate)
    const name = req.body.name || req.body.title;
    const description = req.body.description;
    const difficulty = req.body.difficulty || (req.body.priority === 'high' ? 'difficile' : req.body.priority === 'medium' ? 'moyen' : 'facile');
    const date = req.body.date || req.body.dueDate;

    if (!name || !difficulty || !date) {
      throw new AppError(400, 'name (ou title), difficulty (ou priority) et date (ou dueDate) sont requis');
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

    // Bloquer la modification si la tâche est complétée (sauf si on veut juste changer le status)
    if (task.status === 'completed' && !req.body.status) {
      throw new AppError(400, 'Impossible de modifier une tâche complétée');
    }

    // Convertir les nouveaux champs aux anciens s'ils sont présents
    const updateData: any = { ...req.body };
    if (req.body.title) {
      updateData.name = req.body.title;
      delete updateData.title;
    }
    if (req.body.priority) {
      updateData.difficulty = req.body.priority === 'high' ? 'difficile' : req.body.priority === 'medium' ? 'moyen' : 'facile';
      delete updateData.priority;
    }
    if (req.body.dueDate) {
      updateData.date = req.body.dueDate;
      delete updateData.dueDate;
    }
    if (req.body.status) {
      // Supporter les 3 états: pending, in_progress, completed
      // Envoyer SEULEMENT status, le trigger DB se charge de mettre à jour completed
      updateData.status = req.body.status;
      // Ne pas envoyer completed, le trigger BD gère la synchronisation
      delete updateData.completed;
    }

    await taskService.updateTask(id, updateData);

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
