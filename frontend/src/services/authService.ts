import { api } from './api';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  data: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    level: number;
    totalPoints?: number;
  };
  token: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  level: number;
  experience: number;
  createdAt?: string;
}

// Service d'authentification
export const authService = {
  /**
   * Connexion de l'utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Stocker le token dans localStorage
    if (response.status === 'success' && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Stocker le token dans localStorage
    if (response.status === 'success' && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('experiencePercent');
    localStorage.removeItem('userEmail');
  },

  /**
   * Récupération de l'utilisateur courant
   */
  async getCurrentUser(): Promise<AuthUser> {
    return await api.get<AuthUser>('/auth/me');
  },

  /**
   * Vérification si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!token && isAuth === 'true';
  },

  /**
   * Récupération du token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  /**
   * Récupération des données utilisateur stockées
   */
  getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
