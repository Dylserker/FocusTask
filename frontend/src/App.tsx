import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Header from './components/Header/Header';
import InstallPWA from './components/InstallPWA/InstallPWA';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { authService } from './services/authService';
import { settingsService } from './services/settingsService';
import { applyTheme, getStoredTheme, setStoredTheme } from './utils/theme';

import './App.css';

function Content() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      <Header />
      <main className={isAuthPage ? 'main-content auth' : 'main-content'}>
        <AppRouter />
      </main>
      {!isAuthPage && <InstallPWA />}
    </div>
  );
}

function App() {
  useEffect(() => {
    const storedTheme = getStoredTheme() ?? 'light';
    applyTheme(storedTheme);

    const syncTheme = async () => {
      if (!authService.isAuthenticated()) return;

      try {
        const settings = await settingsService.getSettings();
        const theme = settings?.theme ?? 'light';
        applyTheme(theme);
        setStoredTheme(theme);
      } catch {
        // Pas bloquant : on conserve le thème local
      }
    };

    syncTheme();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Content />
      </AuthProvider>
    </Router>
  );
}

export default App;
