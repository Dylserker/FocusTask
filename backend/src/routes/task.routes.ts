import { Router } from 'express';
import taskController from '../controllers/task.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes protégées - Ordre important: routes spécifiques avant génériques!

// Routes GET spécifiques
router.get('/today', authenticate, async (req, res, next) => {
  try {
    await taskController.getTodayTasks(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes PATCH/DELETE spécifiques
router.patch('/:taskId/complete', authenticate, async (req, res, next) => {
  try {
    await taskController.completeTask(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/:taskId', authenticate, async (req, res, next) => {
  try {
    await taskController.updateTask(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:taskId', authenticate, async (req, res, next) => {
  try {
    await taskController.deleteTask(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes GET générales
router.get('/', authenticate, async (req, res, next) => {
  try {
    await taskController.getTasks(req, res);
  } catch (error) {
    next(error);
  }
});

// Route GET par date (doit être après les routes spécifiques)
router.get('/:date', authenticate, async (req, res, next) => {
  try {
    await taskController.getTasksByDate(req, res);
  } catch (error) {
    next(error);
  }
});

// Routes POST
router.post('/', authenticate, async (req, res, next) => {
  try {
    await taskController.createTask(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
