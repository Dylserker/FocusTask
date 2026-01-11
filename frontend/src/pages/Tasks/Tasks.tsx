import { useState, useEffect } from 'react';
import TaskModal from '../../components/Modal/ModalTask/TaskModal';
import { taskService } from '../../services/taskService';
import { achievementService } from '../../services/achievementService';
import './Tasks.css';

// Fonction utilitaire pour formater une date au format YYYY-MM-DD en heure locale
const formatDateLocal = (dateInput?: string | Date): string => {
  if (!dateInput) {
    // Si pas de date, utiliser la date locale actuelle
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Si c'est une string, la traiter comme YYYY-MM-DD ou ISO
  if (typeof dateInput === 'string') {
    // Si c'est déjà au format YYYY-MM-DD, retourner tel quel
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    // Si c'est du format ISO (avec T), extraire la date locale
    if (dateInput.includes('T')) {
      // Parse en Date pour la convertir en heure locale
      const date = new Date(dateInput);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return dateInput.toString().split('T')[0];
};

interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les tâches au montage du composant
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      const formattedTasks = fetchedTasks.map((task: any) => {
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';
        if (task.status) {
          status = task.status;
        } else if (task.completed) {
          status = 'completed';
        }
        return {
          id: task.id,
          name: task.name || task.title,
          description: task.description || '',
          difficulty: task.difficulty || (task.priority === 'high' ? 'difficile' : task.priority === 'medium' ? 'moyen' : 'facile'),
          date: formatDateLocal(task.date || task.dueDate),
          status,
        };
      });
      setTasks(formattedTasks);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      setError(null);
      if (editingTask) {
        // Modification
        await taskService.updateTask(editingTask.id, {
          title: taskData.name,
          description: taskData.description,
          priority: taskData.difficulty === 'difficile' ? 'high' : taskData.difficulty === 'moyen' ? 'medium' : 'low',
          dueDate: taskData.date,
          status: taskData.status,
        });
        setTasks(tasks.map(task => 
          task.id === editingTask.id 
            ? { ...taskData, id: editingTask.id }
            : task
        ));
        setEditingTask(null);
      } else {
        // Création
        const newTask = await taskService.createTask({
          title: taskData.name,
          description: taskData.description,
          priority: taskData.difficulty === 'difficile' ? 'high' : taskData.difficulty === 'moyen' ? 'medium' : 'low',
          dueDate: taskData.date,
        });
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';
        if ((newTask as any).status) {
          status = (newTask as any).status;
        } else if ((newTask as any).completed) {
          status = 'completed';
        }
        const formattedTask: Task = {
          id: newTask.id,
          name: (newTask as any).name || newTask.title,
          description: newTask.description || '',
          difficulty: (newTask as any).difficulty || (newTask.priority === 'high' ? 'difficile' : newTask.priority === 'medium' ? 'moyen' : 'facile'),
          date: formatDateLocal((newTask as any).date || newTask.dueDate),
          status,
        };
        setTasks([...tasks, formattedTask]);
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la tâche');
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleTask = async (id: number) => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      // Cycle: pending → in_progress → completed → pending
      let newStatus: 'pending' | 'in_progress' | 'completed' = 'pending';
      if (task.status === 'pending') {
        newStatus = 'in_progress';
      } else if (task.status === 'in_progress') {
        newStatus = 'completed';
      } else {
        newStatus = 'pending';
      }

      await taskService.updateTask(id, {
        status: newStatus,
      });

      setTasks(tasks.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      ));

      // Si la tâche est marquée comme complétée, vérifier les succès
      if (newStatus === 'completed') {
        try {
          await achievementService.checkAchievements();
        } catch (err) {
          console.error('Erreur lors de la vérification des succès:', err);
          // On ne lance pas une erreur, juste on log
        }
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error(err);
    }
  };

  const getWeekStart = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff + (offset * 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const getWeekDays = () => {
    const weekStart = getWeekStart(currentWeekOffset);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const weekDays = getWeekDays();
  const weekStart = getWeekStart(currentWeekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Mes Tâches</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn btn-primary"
          disabled={isLoading}
        >
          + Nouvelle tâche
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button 
            className="alert-close"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {isLoading && <div className="loading">Chargement des tâches...</div>}

      {!isLoading && (
        <>
          <div className="week-navigation">
            <div className="week-nav-spacer" aria-hidden="true" />
            <div className="week-nav-center">
              <button 
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="week-nav-btn"
                aria-label="Semaine précédente"
              >
                ←
              </button>
              <div className="week-info">
                {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <button 
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="week-nav-btn"
                aria-label="Semaine suivante"
              >
                →
              </button>
            </div>
            {currentWeekOffset !== 0 && (
              <button 
                onClick={() => setCurrentWeekOffset(0)}
                className="btn-today"
              >
                Aujourd'hui
              </button>
            )}
          </div>

          <div className="week-grid">
            {weekDays.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className={`day-column ${isToday ? 'today' : ''}`}>
                  <div className="day-header">
                    <div className="day-name">
                      {day.toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </div>
                    <div className="day-date">
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="day-tasks">
                    {dayTasks.map(task => (
                      <div key={task.id} className={`task-card status-${task.status}`}>
                        <div className="task-card-header">
                          <button
                            className={`task-status-button status-${task.status}`}
                            onClick={() => toggleTask(task.id)}
                            title={`État: ${task.status === 'pending' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}`}
                          >
                            {task.status === 'pending' ? '○' : task.status === 'in_progress' ? '◐' : '●'}
                          </button>
                          <div className={`task-difficulty difficulty-${task.difficulty}`}>
                            {task.difficulty.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="task-card-title">{task.name}</div>
                        {task.description && (
                          <div className="task-card-description">{task.description}</div>
                        )}
                        <div className="task-card-actions">
                          <button 
                            onClick={() => handleEditTask(task)} 
                            className="btn-edit-small"
                            aria-label="Modifier"
                            title={task.status === 'completed' ? 'Voir les détails' : 'Modifier'}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)} 
                            className="btn-delete-small"
                            aria-label="Supprimer"
                            disabled={task.status === 'completed'}
                            title={task.status === 'completed' ? 'Impossible de supprimer une tâche complétée' : 'Supprimer'}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;
