import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type AuthUser } from '../services/authService';
import { userService } from '../services/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userName: string;
  userLevel: number;
  experiencePercent: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  setUserData: (data: { userName: string; userLevel: number; experiencePercent: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userName, setUserName] = useState('Utilisateur');
  const [userLevel, setUserLevel] = useState(1);
  const [experiencePercent, setExperiencePercent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Vérifie si l'utilisateur est connecté au chargement et récupère ses données
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        
        if (isAuth) {
          // Récupérer les données utilisateur depuis le backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          setUserName(userData.username);
          setUserLevel(userData.level);
          setExperiencePercent(userService.calculateExperiencePercent(userData.experience, userData.level));
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // En cas d'erreur, nettoyer les données d'authentification
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.status === 'success' && response.data) {
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          level: response.data.level || 1,
          experience: response.data.totalPoints || 0,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setUserName(userData.username);
        setUserLevel(userData.level);
        setExperiencePercent(userService.calculateExperiencePercent(userData.experience, userData.level));
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.register({ username, email, password });
      
      if (response.status === 'success' && response.data) {
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          level: response.data.level || 1,
          experience: response.data.totalPoints || 0,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setUserName(userData.username);
        setUserLevel(userData.level);
        setExperiencePercent(userService.calculateExperiencePercent(userData.experience, userData.level));
      } else {
        throw new Error(response.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserName('Utilisateur');
    setUserLevel(1);
    setExperiencePercent(0);
  };

  const refreshUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setUserName(userData.username);
      setUserLevel(userData.level);
      setExperiencePercent(userService.calculateExperiencePercent(userData.experience, userData.level));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
    }
  };

  const setUserData = (data: { userName: string; userLevel: number; experiencePercent: number }) => {
    setUserName(data.userName);
    setUserLevel(data.userLevel);
    setExperiencePercent(data.experiencePercent);

    localStorage.setItem('userName', data.userName);
    localStorage.setItem('userLevel', data.userLevel.toString());
    localStorage.setItem('experiencePercent', data.experiencePercent.toString());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userName,
        userLevel,
        experiencePercent,
        loading,
        login,
        register,
        logout,
        refreshUserData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
