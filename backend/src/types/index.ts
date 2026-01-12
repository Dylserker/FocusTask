export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  join_date: Date;
  level: number;
  experience_points: number;
  experience_percent: number;
  tasks_completed: number;
  current_streak: number;
  total_points: number;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  difficulty: 'facile' | 'moyen' | 'difficile';
  date: Date;
  completed: boolean;
  completed_at: Date | null;
  deleted_at?: Date | null;
  status?: 'pending' | 'in_progress' | 'completed';
  points_earned: number;
  created_at: Date;
  updated_at: Date;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  points_reward: number;
  created_at: Date;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: Date;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  points_required: number;
  icon: string;
  created_at: Date;
}

export interface UserReward {
  id: number;
  user_id: number;
  reward_id: number;
  unlocked_at: Date;
}

export interface Settings {
  id: number;
  user_id: number;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sound_effects: boolean;
  daily_reminder_time: string;
  theme: string;
  language: string;
  timezone: string;
  daily_goal: number;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  userId: number;
  username: string;
}
