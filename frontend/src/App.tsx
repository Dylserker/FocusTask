import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import InstallPWA from './components/InstallPWA/InstallPWA';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';

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
  return (
    <Router basename="/FocusTask">
      <AuthProvider>
        <Content />
      </AuthProvider>
    </Router>
  );
}

export default App;
