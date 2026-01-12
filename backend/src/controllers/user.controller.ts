import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import userService from '../services/user.service';
import bcrypt from 'bcrypt';

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

    const { username, email, firstName, lastName, photoUrl } = req.body;
    const updateData: any = {};

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== undefined) {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser && existingUser.id !== req.userId) {
        throw new AppError(400, 'Cet email est déjà utilisé');
      }
      updateData.email = email;
    }

    // Vérifier si le username est déjà utilisé par un autre utilisateur
    if (username !== undefined) {
      const existingUser = await userService.getUserByUsername(username);
      if (existingUser && existingUser.id !== req.userId) {
        throw new AppError(400, 'Ce nom d\'utilisateur est déjà utilisé');
      }
      updateData.username = username;
    }

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
        email: user?.email,
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

  async changePassword(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'Mot de passe actuel et nouveau mot de passe requis');
    }

    const user = await userService.getUserById(req.userId);
    if (!user) {
      throw new AppError(404, 'Utilisateur non trouvé');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      throw new AppError(400, 'Mot de passe actuel incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await userService.updateUser(req.userId, { password_hash: hashed });

    res.status(200).json({
      status: 'success',
      message: 'Mot de passe mis à jour',
    });
  }

  async deleteAccount(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    await userService.deleteUser(req.userId);

    res.status(204).send();
  }
}

export default new UserController();
