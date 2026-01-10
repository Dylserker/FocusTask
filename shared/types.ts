// Types partagés entre Frontend et Backend

// ============================
// Types d'Authentification
// ============================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  experience: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

// ============================
// Types de Tâches
// ============================

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  estimatedTime?: number;
  experienceReward: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  estimatedTime?: number;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus;
}

// ============================
// Types d'Achievements
// ============================

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  icon?: string;
  experienceReward: number;
  condition: string;
  conditionValue: number;
  createdAt?: string;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  unlockedAt: string;
  achievement?: Achievement;
}

// ============================
// Types de Récompenses
// ============================

export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  icon?: string;
  category?: string;
  isAvailable: boolean;
  createdAt?: string;
}

export interface UserReward {
  id: number;
  userId: number;
  rewardId: number;
  redeemedAt: string;
  reward?: Reward;
}

// ============================
// Types de Paramètres
// ============================

export type Theme = 'light' | 'dark' | 'auto';

export interface UserSettings {
  id: number;
  userId: number;
  theme: Theme;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
  dailyGoal?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsDTO {
  theme?: Theme;
  language?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  dailyGoal?: number;
}

// ============================
// Types de Statistiques
// ============================

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalAchievements: number;
  unlockedAchievements: number;
  totalRewards: number;
  redeemedRewards: number;
  currentStreak: number;
  longestStreak: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

// ============================
// Types de Réponses API
// ============================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================
// Types de Pagination
// ============================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================
// Types de Filtres
// ============================

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  endDate?: string;
}

export interface AchievementFilters {
  category?: string;
  unlocked?: boolean;
}
