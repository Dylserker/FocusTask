import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, userLevel, experiencePercent, photoUrl, logout } = useAuth();
  
  console.log('🔍 Header Debug:', {
    userName,
    userLevel,
    experiencePercent,
    photoUrl,
    photoUrlType: typeof photoUrl,
    photoUrlLength: photoUrl?.length
  });
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return null; // Ne pas afficher le header sur les pages d'authentification
  }

  if (!isAuthenticated) {
    return null; // Ne pas afficher le header si l'utilisateur n'est pas connecté
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-top">
          <Link to="/" className="logo">FocusTask</Link>
          <div className="profile-section">
            <Link to="/profile" className="profile-avatar-wrapper">
              <svg className="progress-ring" width="140" height="140">
                <circle
                  className="progress-ring-bg"
                  stroke="#e1e8ed"
                  strokeWidth="8"
                  fill="transparent"
                  r="62"
                  cx="70"
                  cy="70"
                />
                <circle
                  className="progress-ring-progress"
                  stroke="url(#header-gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  r="62"
                  cx="70"
                  cy="70"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 62}`,
                    strokeDashoffset: `${2 * Math.PI * 62 * (1 - experiencePercent / 100)}`,
                  }}
                />
                <defs>
                  <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="profile-avatar">
                {photoUrl ? (
                  <img src={photoUrl} alt={`Avatar de ${userName}`} />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            <div className="profile-info">
              <div className="profile-username">{userName}</div>
              <div className="profile-level">Niveau {userLevel}</div>
            </div>
          </div>
        </div>
        <nav className="nav">
          <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''}>
            📝 Tâches
          </Link>
          <Link to="/achievements" className={location.pathname === '/achievements' ? 'active' : ''}>
            🏆 Succès
          </Link>
          <Link to="/rewards" className={location.pathname === '/rewards' ? 'active' : ''}>
            🎁 Récompenses
          </Link>
          <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
            ⚙️ Paramètres
          </Link>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
