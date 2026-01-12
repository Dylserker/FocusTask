import { useState, useEffect } from 'react';
import { settingsService, type UserSettings } from '../../services/settingsService';
import './Settings.css';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [dailyReminderTime, setDailyReminderTime] = useState('09:00');
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Europe/Paris');
  
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
        setEmailNotifications(settings.emailNotifications ?? false);
        setSoundEffects(settings.soundEffects ?? true);
        setDarkMode(settings.theme === 'dark');
        setDailyGoal(settings.dailyGoal ?? 5);
        setDailyReminderTime(settings.dailyReminderTime?.substring(0, 5) ?? '09:00');
        setLanguage(settings.language ?? 'fr');
        setTimezone(settings.timezone ?? 'Europe/Paris');
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
        emailNotifications: emailNotifications,
        soundEffects: soundEffects,
        theme: darkMode ? 'dark' : 'light',
        dailyGoal: dailyGoal,
        dailyReminderTime: dailyReminderTime,
        language: language,
        timezone: timezone,
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
        <h2>Notifications et Alertes</h2>
        
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
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="emailNotifications">Notifications par Email</label>
            <p>Recevoir des emails sur vos progrès hebdomadaires</p>
          </div>
          <input
            type="checkbox"
            id="emailNotifications"
            className="toggle"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="soundEffects">Effets Sonores</label>
            <p>Activer les sons lors des notifications</p>
          </div>
          <input
            type="checkbox"
            id="soundEffects"
            className="toggle"
            checked={soundEffects}
            onChange={(e) => setSoundEffects(e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="dailyReminderTime">Heure du Rappel Quotidien</label>
            <p>À quelle heure souhaitez-vous le rappel?</p>
          </div>
          <input
            type="time"
            id="dailyReminderTime"
            value={dailyReminderTime}
            onChange={(e) => setDailyReminderTime(e.target.value)}
            style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Préférences d'Interface</h2>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="darkMode">Mode Sombre</label>
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
            <label htmlFor="language">Langue</label>
            <p>Choisir la langue de l'interface</p>
          </div>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="timezone">Fuseau Horaire</label>
            <p>Sélectionner votre fuseau horaire</p>
          </div>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={{ width: '200px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            <option value="Australia/Sydney">Australia/Sydney (UTC+11)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Objectifs</h2>

        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="dailyGoal">Objectif Quotidien</label>
            <p>Nombre de tâches à compléter par jour</p>
          </div>
          <input
            type="number"
            id="dailyGoal"
            min="1"
            max="50"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value) || 5)}
            style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
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
