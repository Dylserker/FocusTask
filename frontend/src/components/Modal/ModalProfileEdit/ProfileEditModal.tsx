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
  onSave: (payload: EditableUserProfile) => void;
};

const ProfileEditModal = ({ isOpen, user, onClose, onSave }: ProfileEditModalProps) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? galleryOptions[0].url);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername(user.username);
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhotoUrl(user.photoUrl ?? galleryOptions[0].url);
      setShowGallery(false);
    }
  }, [isOpen, user.email, user.firstName, user.lastName, user.photoUrl, user.username]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !email.trim()) return;

    onSave({
      username: username.trim(),
      email: email.trim(),
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre pseudo"
              required
              autoFocus
            />
          </div>

          <div className="profile-modal__group">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@example.com"
              required
            />
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
