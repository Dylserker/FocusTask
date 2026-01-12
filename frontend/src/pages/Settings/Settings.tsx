import { useState, useEffect } from 'react';
import { settingsService, type UserSettings } from '../../services/settingsService';
import './Settings.css';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Charger les paramètres au montage du composant
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const settings: UserSettings = await settingsService.getSettings();
      
      if (settings) {
        setNotifications(settings.notifications ?? true);
        setDarkMode(settings.theme === 'dark');
        setEmailUpdates(settings.emailNotifications ?? false);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError('Impossible de charger les paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      await settingsService.updateSettings({
        notifications: notifications,
        theme: darkMode ? 'dark' : 'light',
        emailNotifications: emailUpdates,
      });

      setSuccessMessage('Paramètres sauvegardés avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
      setError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (checked: boolean) => {
    setNotifications(checked);
  };

  if (isLoading) {
    return (
      <div className="settings-container">
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>

      {error && (
        <div className="alert alert-error" style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#fee', 
          color: '#c33',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#efe', 
          color: '#3c3',
          borderRadius: '5px'
        }}>
          {successMessage}
        </div>
      )}

      <div className="settings-section">
        <h2>Préférences</h2>
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="notifications">Notifications</label>
            <p>Recevoir des notifications pour les rappels de tâches</p>
          </div>
          <input
            type="checkbox"
            id="notifications"
            className="toggle"
            checked={notifications}
            onChange={(e) => handleNotificationChange(e.target.checked)}
          />
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="darkMode">Mode sombre</label>
            <p>Activer le thème sombre</p>
          </div>
          <input
            type="checkbox"
            id="darkMode"
            className="toggle"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="emailUpdates">Mises à jour par email</label>
            <p>Recevoir des emails sur vos progrès hebdomadaires</p>
          </div>
          <input
            type="checkbox"
            id="emailUpdates"
            className="toggle"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Compte</h2>
        <button className="btn btn-secondary">Changer le mot de passe</button>
        <button className="btn btn-danger">Supprimer le compte</button>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder les paramètres'}
      </button>
    </div>
  );
};

export default Settings;
