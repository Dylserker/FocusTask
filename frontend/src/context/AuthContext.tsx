import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  userLevel: number;
  experiencePercent: number;
  login: (email: string, name: string) => void;
  logout: () => void;
  setUserData: (data: { userName: string; userLevel: number; experiencePercent: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Utilisateur');
  const [userLevel, setUserLevel] = useState(1);
  const [experiencePercent, setExperiencePercent] = useState(0);

  // Vérifie si l'utilisateur est connecté au chargement
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUserName = localStorage.getItem('userName');
    const storedUserLevel = localStorage.getItem('userLevel');
    const storedExperiencePercent = localStorage.getItem('experiencePercent');

    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      storedUserName && setUserName(storedUserName);
      storedUserLevel && setUserLevel(parseInt(storedUserLevel));
      storedExperiencePercent && setExperiencePercent(parseInt(storedExperiencePercent));
    }
  }, []);

  const login = (email: string, name: string) => {
    // TODO: Implémenter l'authentification avec le backend
    setIsAuthenticated(true);
    setUserName(name);
    setUserLevel(1);
    setExperiencePercent(0);

    // Stocker les données en localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userLevel', '1');
    localStorage.setItem('experiencePercent', '0');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('Utilisateur');
    setUserLevel(1);
    setExperiencePercent(0);

    // Supprimer les données du localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('experiencePercent');
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
        userName,
        userLevel,
        experiencePercent,
        login,
        logout,
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
