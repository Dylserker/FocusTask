import { useState } from 'react';

import './Settings.css';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleSave = () => {
    // TODO: Sauvegarder les paramètres
    alert('Paramètres sauvegardés !');
  };

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>

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
            onChange={(e) => setNotifications(e.target.checked)}
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

      <button className="btn btn-primary" onClick={handleSave}>
        Sauvegarder les paramètres
      </button>
    </div>
  );
};

export default Settings;
