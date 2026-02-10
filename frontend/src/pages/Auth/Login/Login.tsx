import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../../context/AuthContext';

import '../Auth.css';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth.errors.fillAllFields'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Appeler la fonction login du contexte avec le backend
      await login(email, password);
      
      // Rediriger vers la page d'accueil après connexion réussie
      navigate('/');
    } catch (err: any) {
      // Gérer les erreurs de connexion
      const errorMessage = err?.response?.data?.message || err?.message || t('auth.errors.loginFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('auth.loginTitle')}</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">{t('auth.emailLabel')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('auth.placeholders.email')}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.passwordLabel')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('auth.placeholders.password')}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.loginLoading') : t('auth.loginButton')}
          </button>
        </form>
        <p className="auth-link">
          {t('auth.linkNoAccount')} <Link to="/register">{t('auth.linkSignup')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

