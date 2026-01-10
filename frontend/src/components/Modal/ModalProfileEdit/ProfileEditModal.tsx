import { useEffect, useState } from 'react';
import './ProfileEditModal.css';

export type EditableUserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
};

type AvatarOption = {
  id: string;
  label: string;
  url: string;
};

const galleryOptions: AvatarOption[] = [
  {
    id: 'focus-1',
    label: 'Focus Bleu',
    url: 'https://dummyimage.com/300x300/667eea/ffffff&text=Focus',
  },
  {
    id: 'focus-2',
    label: 'Violet',
    url: 'https://dummyimage.com/300x300/764ba2/ffffff&text=Task',
  },
  {
    id: 'focus-3',
    label: 'Vert',
    url: 'https://dummyimage.com/300x300/34d399/ffffff&text=Zen',
  },
];

type ProfileEditModalProps = {
  isOpen: boolean;
  user: EditableUserProfile;
  onClose: () => void;
  onSave: (payload: Pick<EditableUserProfile, 'firstName' | 'lastName' | 'photoUrl'>) => void;
  loading?: boolean;
};

const ProfileEditModal = ({ isOpen, user, onClose, onSave, loading }: ProfileEditModalProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? galleryOptions[0].url);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhotoUrl(user.photoUrl ?? galleryOptions[0].url);
      setShowGallery(false);
    }
  }, [isOpen, user.firstName, user.lastName, user.photoUrl]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      photoUrl: photoUrl.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal__overlay" onClick={onClose}>
      <div className="profile-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal__header">
          <h2>Modifier le compte</h2>
          <button className="profile-modal__close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <form className="profile-modal__form" onSubmit={handleSubmit}>
          <div className="profile-modal__group">
            <label htmlFor="profile-username">Nom d'utilisateur</label>
            <input
              id="profile-username"
              type="text"
              value={user.username}
              disabled
              placeholder="Votre pseudo"
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Le nom d'utilisateur ne peut pas être modifié
            </small>
          </div>

          <div className="profile-modal__group">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              placeholder="vous@example.com"
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              L'email ne peut pas être modifié
            </small>
          </div>

          <div className="profile-modal__row">
            <div className="profile-modal__group">
              <label htmlFor="profile-firstname">Prénom</label>
              <input
                id="profile-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                disabled={loading}
              />
            </div>
            <div className="profile-modal__group">
              <label htmlFor="profile-lastname">Nom</label>
              <input
                id="profile-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div className="profile-modal__group">
            <label>Photo de profil</label>
            <div className="profile-modal__preview">
              <img src={photoUrl} alt="Avatar selectionne" />
              <div className="profile-modal__preview-info">
                <span>Avatar actuel</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGallery((prev) => !prev)}
                >
                  {showGallery ? 'Fermer la galerie' : 'Choisir dans la galerie'}
                </button>
              </div>
            </div>
            {showGallery && (
              <div className="profile-modal__gallery">
                {galleryOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={`profile-modal__thumb ${photoUrl === option.url ? 'selected' : ''}`}
                    onClick={() => setPhotoUrl(option.url)}
                    aria-pressed={photoUrl === option.url}
                  >
                    <img src={option.url} alt={option.label} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="profile-modal__actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
