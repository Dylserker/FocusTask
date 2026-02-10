import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../../context/AuthContext';

import '../Auth.css';

const Register = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.passwordMin'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Appeler la fonction register du contexte avec le backend
      await register(username, email, password);
      
      // Rediriger vers la page d'accueil après inscription réussie
      navigate('/');
    } catch (err: any) {
      // Gérer les erreurs d'inscription
      const errorMessage = err?.response?.data?.message || err?.message || t('auth.errors.registerFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('auth.registerTitle')}</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">{t('auth.usernameLabel')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder={t('auth.placeholders.username')}
              disabled={loading}
            />
          </div>
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
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t('auth.placeholders.confirmPassword')}
              minLength={6}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.registerLoading') : t('auth.registerButton')}
          </button>
        </form>
        <p className="auth-link">
          {t('auth.linkHaveAccount')} <Link to="/login">{t('auth.linkLogin')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

