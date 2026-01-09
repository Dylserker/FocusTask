import { useState } from 'react';
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
  const [user, setUser] = useState<UserProfile>({
    username: 'Utilisateur',
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    photoUrl: '',
    joinDate: '2026-01-01',
    tasksCompleted: 15,
    currentStreak: 3,
    level: 5,
    experiencePercent: 65,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProfile = (
    payload: Pick<UserProfile, 'username' | 'email' | 'firstName' | 'lastName' | 'photoUrl'>,
  ) => {
    setUser((prev) => ({ ...prev, ...payload }));
    setIsModalOpen(false);
  };

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
      />
    </div>
  );
};

export default Profile;
