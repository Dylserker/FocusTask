import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import ProfileEditModal from '../../components/Modal/ModalProfileEdit/ProfileEditModal';
import './Profile.css';

type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  joinDate: string;
  tasksCompleted: number;
  currentStreak: number;
  level: number;
  experiencePercent: number;
};

const Profile = () => {
  const { user: authUser, userLevel, experiencePercent, refreshUserData } = useAuth();
  const [user, setUser] = useState<UserProfile>({
    username: 'Utilisateur',
    email: 'user@example.com',
    firstName: '',
    lastName: '',
    photoUrl: '',
    joinDate: new Date().toISOString(),
    tasksCompleted: 0,
    currentStreak: 0,
    level: 1,
    experiencePercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les données du profil et les stats
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        
        // Le profil contient déjà les stats
        const profileData = await userService.getProfile();

        setUser({
          username: profileData.username,
          email: profileData.email,
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          photoUrl: profileData.photoUrl || '',
          joinDate: profileData.joinDate || profileData.createdAt || new Date().toISOString(),
          tasksCompleted: profileData.tasksCompleted || 0,
          currentStreak: profileData.currentStreak || 0,
          level: profileData.level || userLevel,
          experiencePercent: profileData.experiencePercent || experiencePercent,
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        // Utiliser les données du contexte en cas d'erreur
        if (authUser) {
          setUser(prev => ({
            ...prev,
            username: authUser.username,
            email: authUser.email,
            level: userLevel,
            experiencePercent: experiencePercent,
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [authUser, userLevel, experiencePercent]);

  const handleSaveProfile = async (
    payload: Pick<UserProfile, 'username' | 'email' | 'firstName' | 'lastName' | 'photoUrl'>,
  ) => {
    try {
      setIsSaving(true);
      
      // Mettre à jour le profil via l'API
      const updatedUser = await userService.updateProfile({
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        photoUrl: payload.photoUrl,
      });

      // Rafraîchir les données utilisateur dans le contexte
      await refreshUserData();

      // Mettre à jour l'état local avec les nouvelles données
      setUser((prev) => ({
        ...prev,
        username: updatedUser.username || prev.username,
        email: updatedUser.email || prev.email,
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        photoUrl: updatedUser.photoUrl || '',
      }));
      
      setIsModalOpen(false);
      
      // Message de succès
      alert('Profil mis à jour avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      const errorMessage = error?.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Profil</h1>
      
      <div className="profile-card">
        <div className="profile-avatar-wrapper">
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
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              r="62"
              cx="70"
              cy="70"
              style={{
                strokeDasharray: `${2 * Math.PI * 62}`,
                strokeDashoffset: `${2 * Math.PI * 62 * (1 - user.experiencePercent / 100)}`,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="profile-avatar">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={`Avatar de ${user.username}`} />
            ) : (
              (user.firstName || user.username).charAt(0).toUpperCase()
            )}
          </div>
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <div className="profile-level">Niveau {user.level}</div>
          <div className="profile-name">{`${user.firstName} ${user.lastName}`.trim()}</div>
        </div>
        <p className="profile-email">{user.email}</p>
        <div className="profile-actions">
          <button className="profile-edit-button" onClick={() => setIsModalOpen(true)}>
            Modifier le profil
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{user.tasksCompleted}</div>
          <div className="stat-label">Tâches complétées</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{user.currentStreak}</div>
          <div className="stat-label">Jours consécutifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">
            {new Date(user.joinDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="stat-label">Membre depuis</div>
        </div>
      </div>
      <ProfileEditModal
        isOpen={isModalOpen}
        user={user}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
        loading={isSaving}
      />
    </div>
  );
};

export default Profile;
