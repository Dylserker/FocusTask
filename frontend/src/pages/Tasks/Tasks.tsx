import { useState } from 'react';
import TaskModal from '../../components/Modal/ModalTask/TaskModal';
import './Tasks.css';

interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  date: string;
  completed: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      name: 'Créer la première tâche', 
      description: 'Exemple de tâche avec description',
      difficulty: 'facile',
      date: new Date().toISOString().split('T')[0],
      completed: false 
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { 
        id: Date.now(), 
        ...taskData, 
        completed: false 
      }]);
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

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
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
        >
          + Nouvelle tâche
        </button>
      </div>

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
                  <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                    <div className="task-card-header">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />
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
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="btn-delete-small"
                        aria-label="Supprimer"
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
