import './Achievements.css';
import { useEffect, useState } from 'react';
import { achievementService } from '../../services';
import { useApi } from '../../hooks/useApi';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  points_reward: number;
}

interface UserAchievement extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { execute } = useApi();

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer tous les achievements disponibles
        const allAchievements = await execute(
          () => achievementService.getAllAchievements(),
          {
            onError: (err) => {
              setError(err.message || 'Erreur lors du chargement des succès');
            },
          }
        );

        // Récupérer les achievements débloqués par l'utilisateur
        const userAchievements = await execute(
          () => achievementService.getUserAchievements(),
          {
            onError: (err) => {
              console.error('Erreur lors du chargement des succès utilisateur:', err);
              // Continuer même si cela échoue
            },
          }
        );

        // Créer une liste enrichie avec statut d'unlock
        if (allAchievements) {
          const unlockedIds = new Set(userAchievements?.map((ua) => ua.achievement_id || ua.id) || []);
          const enrichedAchievements = allAchievements.map((achievement) => ({
            ...achievement,
            unlocked: unlockedIds.has(achievement.id),
          }));
          setAchievements(enrichedAchievements);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des achievements:', err);
        setError('Impossible de charger les succès');
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [execute]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (loading) {
    return (
      <div className="achievements-container">
        <h1>Succès</h1>
        <p>Chargement des succès...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-container">
        <h1>Succès</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <h1>Succès</h1>
      <p className="achievements-progress">
        {unlockedCount} / {achievements.length} débloqués
      </p>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            <span className="points-badge">+{achievement.points_reward} pts</span>
            {achievement.unlocked && <span className="badge">Débloqué</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
