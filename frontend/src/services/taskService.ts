import { api } from './api';

// Types pour les tâches
export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  estimatedTime?: number; // en minutes
  experienceReward: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  estimatedTime?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

// Service de gestion des tâches
export const taskService = {
  /**
   * Récupération de toutes les tâches de l'utilisateur
   */
  async getAllTasks(filter?: { status?: string; priority?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.priority) params.append('priority', filter.priority);
    
    const queryString = params.toString();
    const url = `/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<TasksResponse>(url);
    return response.data;
  },

  /**
   * Récupération d'une tâche par son ID
   */
  async getTaskById(taskId: number): Promise<Task> {
    const response = await api.get<TaskResponse>(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Création d'une nouvelle tâche
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await api.post<TaskResponse>('/tasks', taskData);
    return response.data;
  },

  /**
   * Mise à jour d'une tâche
   */
  async updateTask(taskId: number, taskData: UpdateTaskData): Promise<Task> {
    const response = await api.put<TaskResponse>(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  /**
   * Suppression d'une tâche
   */
  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },

  /**
   * Marquer une tâche comme complétée
   */
  async completeTask(taskId: number): Promise<Task> {
    const response = await api.patch<TaskResponse>(`/tasks/${taskId}/complete`);
    return response.data;
  },

  /**
   * Récupération des statistiques des tâches
   */
  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  }> {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};
