import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import userService from '../services/user.service';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const user = await userService.getUserById(req.userId);
    if (!user) {
      throw new AppError(404, 'Utilisateur non trouvé');
    }

    const stats = await userService.getStats(req.userId);

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        joinDate: user.join_date,
        level: user.level,
        experiencePoints: user.experience_points,
        experiencePercent: user.experience_percent,
        tasksCompleted: user.tasks_completed,
        currentStreak: user.current_streak,
        totalPoints: user.total_points,
        stats,
      },
    });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { firstName, lastName, photoUrl } = req.body;
    const updateData: any = {};

    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (photoUrl !== undefined) updateData.photo_url = photoUrl;

    await userService.updateUser(req.userId, updateData);

    const user = await userService.getUserById(req.userId);

    res.status(200).json({
      status: 'success',
      message: 'Profil mis à jour avec succès',
      data: {
        id: user?.id,
        username: user?.username,
        firstName: user?.first_name,
        lastName: user?.last_name,
        photoUrl: user?.photo_url,
      },
    });
  }

  async getPublicProfile(req: AuthRequest, res: Response) {
    const { userId } = req.params;
    const id = parseInt(userId as string, 10);

    if (isNaN(id)) {
      throw new AppError(400, 'ID utilisateur invalide');
    }

    const user = await userService.getUserById(id);
    if (!user) {
      throw new AppError(404, 'Utilisateur non trouvé');
    }

    const stats = await userService.getStats(id);

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        level: user.level,
        tasksCompleted: user.tasks_completed,
        currentStreak: user.current_streak,
        totalPoints: user.total_points,
        stats,
      },
    });
  }

  async getLeaderboard(req: AuthRequest, res: Response) {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await userService.getAllUsers(limit, offset);

    const data = users.map((user) => ({
      id: user.id,
      username: user.username,
      level: user.level,
      tasksCompleted: user.tasks_completed,
      totalPoints: user.total_points,
      currentStreak: user.current_streak,
    }));

    res.status(200).json({
      status: 'success',
      data,
      pagination: { limit, offset },
    });
  }
}

export default new UserController();
