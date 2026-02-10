import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './InstallPWA.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Sauvegarder dans localStorage que l'utilisateur a refusé
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Ne pas afficher si l'utilisateur a déjà refusé
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setShowInstallButton(false);
    }
  }, []);

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="install-pwa-banner">
      <div className="install-pwa-content">
        <div className="install-pwa-icon">📱</div>
        <div className="install-pwa-text">
          <strong>{t('installPwa.title')}</strong>
          <p>{t('installPwa.description')}</p>
        </div>
        <div className="install-pwa-actions">
          <button onClick={handleInstallClick} className="btn-install">
            {t('installPwa.install')}
          </button>
          <button onClick={handleDismiss} className="btn-dismiss" aria-label={t('installPwa.dismiss')}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
