import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TaskModal.css';

// Fonction pour obtenir la date locale au format YYYY-MM-DD
const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
}

const TaskModal = ({ isOpen, onClose, onSave, task }: TaskModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');
  const [date, setDate] = useState(getLocalDateString());
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const isCompleted = task?.status === 'completed';

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setDifficulty(task.difficulty);
      setDate(task.date);
      setStatus(task.status);
    } else {
      setName('');
      setDescription('');
      setDifficulty('moyen');
      setDate(getLocalDateString());
      setStatus('pending');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({ name: name.trim(), description: description.trim(), difficulty, date, status });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setDifficulty('moyen');
    setDate(getLocalDateString());
    setStatus('pending');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? t('taskModal.editTitle') : t('taskModal.createTitle')}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-name">{t('taskModal.nameLabel')}</label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('taskModal.namePlaceholder')}
              required
              autoFocus
              disabled={isCompleted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">{t('taskModal.descriptionLabel')}</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('taskModal.descriptionPlaceholder')}
              rows={4}
              disabled={isCompleted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-difficulty">{t('taskModal.difficultyLabel')}</label>
            <select
              id="task-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'facile' | 'moyen' | 'difficile')}
              required
              disabled={isCompleted}
            >
              <option value="facile">{t('common.difficulty.easy')}</option>
              <option value="moyen">{t('common.difficulty.medium')}</option>
              <option value="difficile">{t('common.difficulty.hard')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-date">{t('taskModal.dateLabel')}</label>
            <input
              id="task-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isCompleted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status">{t('taskModal.statusLabel')}</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
              disabled={isCompleted}
            >
              <option value="pending">○ {t('common.status.pending')}</option>
              <option value="in_progress">◐ {t('common.status.in_progress')}</option>
              <option value="completed">● {t('common.status.completed')}</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              {t('common.actions.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isCompleted}>
              {task ? t('taskModal.submitEdit') : t('taskModal.submitCreate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
