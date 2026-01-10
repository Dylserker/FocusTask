import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authenticate';
import AppError from '../utils/AppError';
import userService from '../services/user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      throw new AppError(400, 'Username, email et password sont requis');
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new AppError(400, 'Email déjà utilisé');
    }

    const existingUsername = await userService.getUserByUsername(username);
    if (existingUsername) {
      throw new AppError(400, 'Username déjà utilisé');
    }

    const userId = await userService.createUser(username, email, password, firstName, lastName);
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new AppError(500, 'Erreur lors de la création de l\'utilisateur');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  }

  async login(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email et password sont requis');
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new AppError(401, 'Email ou password incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Email ou password incorrect');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        level: user.level,
        totalPoints: user.total_points,
      },
      token,
    });
  }

  async me(req: AuthRequest, res: Response) {
    if (!req.userId) {
      throw new AppError(401, 'Non authentifié');
    }

    const user = await userService.getUserById(req.userId);
    if (!user) {
      throw new AppError(404, 'Utilisateur non trouvé');
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        level: user.level,
        experiencePoints: user.experience_points,
        tasksCompleted: user.tasks_completed,
        currentStreak: user.current_streak,
        totalPoints: user.total_points,
      },
    });
  }
}

export default new AuthController();
