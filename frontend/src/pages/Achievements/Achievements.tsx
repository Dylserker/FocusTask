import './Achievements.css';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const Achievements = () => {
  const achievements: Achievement[] = [
    { id: 1, title: 'Première Tâche', description: 'Créez votre première tâche', icon: '🎯', unlocked: true },
    { id: 2, title: 'Productif', description: 'Complétez 10 tâches', icon: '⚡', unlocked: false },
    { id: 3, title: 'Marathonien', description: 'Complétez 50 tâches', icon: '🏃', unlocked: false },
    { id: 4, title: 'Expert', description: 'Complétez 100 tâches', icon: '🏆', unlocked: false },
    { id: 5, title: 'Semaine Parfaite', description: 'Complétez toutes vos tâches pendant 7 jours', icon: '⭐', unlocked: false },
    { id: 6, title: 'Matinal', description: 'Complétez une tâche avant 8h', icon: '🌅', unlocked: false },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-container">
      <h1>Succès</h1>
      <p className="achievements-progress">
        {unlockedCount} / {achievements.length} débloqués
      </p>

      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            {achievement.unlocked && <span className="badge">Débloqué</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
