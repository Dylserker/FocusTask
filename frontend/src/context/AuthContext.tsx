import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type AuthUser } from '../services/authService';
import { userService } from '../services/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userName: string;
  userLevel: number;
  experiencePercent: number;
  photoUrl: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  setUserData: (data: { userName: string; userLevel: number; experiencePercent: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État initial basé sur le localStorage pour éviter le flash de déconnexion au F5
  const storedUser = authService.getStoredUser();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [userName, setUserName] = useState(storedUser?.username || 'Utilisateur');
  const [userLevel, setUserLevel] = useState(storedUser?.level || 1);
  const [experiencePercent, setExperiencePercent] = useState(storedUser?.experiencePercent || 0);
  const [photoUrl, setPhotoUrl] = useState(storedUser?.photoUrl || '');
  const [loading, setLoading] = useState(true);

  // Vérifie si l'utilisateur est connecté au chargement et récupère ses données
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();

        if (isAuth) {
          // Récupérer les données utilisateur depuis le backend
          const userData = await authService.getCurrentUser();
          console.log('🔍 AuthContext initAuth - userData reçue:', userData);
          console.log('🔍 AuthContext initAuth - experiencePercent:', userData.experiencePercent);
          console.log('🔍 AuthContext initAuth - photoUrl:', userData.photoUrl);
          setUser(userData);
          setIsAuthenticated(true);
          setUserName(userData.username);
          setUserLevel(userData.level);
          setExperiencePercent(userData.experiencePercent || 0);
          setPhotoUrl(userData.photoUrl || '');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        const status = (error as any)?.response?.status;

        // Si le token est invalide, on nettoie; sinon on garde l'état local pour éviter un flash inutile
        if (status === 401 || status === 403) {
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
          setUserName('Utilisateur');
          setUserLevel(1);
          setExperiencePercent(0);
          setPhotoUrl('');
        } else {
          setIsAuthenticated(authService.isAuthenticated());
        }
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
          experience: response.data.experiencePoints || response.data.totalPoints || 0,
          experiencePercent: response.data.experiencePercent || 0,
          photoUrl: response.data.photoUrl || '',
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setUserName(userData.username);
        setUserLevel(userData.level);
        setExperiencePercent(userData.experiencePercent);
        setPhotoUrl(userData.photoUrl);
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
          experience: response.data.experiencePoints || response.data.totalPoints || 0,
          experiencePercent: response.data.experiencePercent || 0,
          photoUrl: response.data.photoUrl || '',
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setUserName(userData.username);
        setUserLevel(userData.level);
        setExperiencePercent(userData.experiencePercent);
        setPhotoUrl(userData.photoUrl);
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
    setPhotoUrl('');
  };

  const refreshUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      console.log('🔍 AuthContext refreshUserData - userData reçue:', userData);
      console.log('🔍 AuthContext refreshUserData - experiencePercent:', userData.experiencePercent);
      console.log('🔍 AuthContext refreshUserData - photoUrl:', userData.photoUrl);
      setUser(userData);
      setUserName(userData.username);
      setUserLevel(userData.level);
      setExperiencePercent(userData.experiencePercent || 0);
      setPhotoUrl(userData.photoUrl || '');
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
        photoUrl,
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
