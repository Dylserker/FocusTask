import './Rewards.css';

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
}

const Rewards = () => {
  const rewards: Reward[] = [
    { id: 1, title: 'Starter Pack', description: 'Pour vos premiers pas', points: 50, unlocked: true },
    { id: 2, title: 'Focus Boost', description: 'Restez concentré 3 jours', points: 150, unlocked: false },
    { id: 3, title: 'Early Bird', description: 'Complétez 5 tâches avant 9h', points: 200, unlocked: false },
    { id: 4, title: 'Consistency', description: '7 jours consécutifs', points: 350, unlocked: false },
  ];

  return (
    <div className="rewards-container">
      <h1>Récompenses</h1>
      <p className="rewards-subtitle">Accumulez des points et débloquez des récompenses</p>

      <div className="rewards-grid">
        {rewards.map((r) => (
          <div key={r.id} className={`reward-card ${r.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="reward-header">
              <span className="reward-icon">🎁</span>
              <span className="reward-points">{r.points} pts</span>
            </div>
            <h3 className="reward-title">{r.title}</h3>
            <p className="reward-desc">{r.description}</p>
            <div className={`reward-status ${r.unlocked ? 'ok' : 'pending'}`}>
              {r.unlocked ? 'Débloquée' : 'À débloquer'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
