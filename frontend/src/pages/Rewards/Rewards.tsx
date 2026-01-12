import './Rewards.css';
import { useEffect, useState } from 'react';
import { rewardService } from '../../services';
import { useApi } from '../../hooks/useApi';
import type { Reward } from '../../../../shared/types';

type CategoryFilter = 'all' | 'title' | 'avatar' | 'template' | 'theme' | 'badge' | 'feature';

const categoryEmojis: Record<string, string> = {
  title: '👑',
  avatar: '🖼️',
  template: '📋',
  theme: '🎨',
  badge: '🏅',
  feature: '⚡',
};

const categoryLabels: Record<string, string> = {
  title: 'Titres',
  avatar: 'Avatars',
  template: 'Templates',
  theme: 'Thèmes',
  badge: 'Badges',
  feature: 'Fonctionnalités',
};

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [stats, setStats] = useState<{
    total: number;
    unlocked: number;
    byCategory: { category: string; total: number; unlocked: number }[];
  } | null>(null);
  const { execute } = useApi();

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    setError(null);

    try {
      const [allRewards, rewardStats] = await Promise.all([
        execute(() => rewardService.getAvailableRewards(), {
          onError: (err) => {
            setError(err.message || 'Erreur lors du chargement des récompenses');
          },
        }),
        execute(() => rewardService.getRewardStats(), {
          onError: (err) => {
            // Erreur silencieuse
          },
        }),
      ]);

      if (allRewards) {
        setRewards(allRewards);
      }
      if (rewardStats) {
        setStats(rewardStats);
      }
    } catch (err) {
      setError('Impossible de charger les récompenses');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockRewardsByPoints = async () => {
    try {
      await rewardService.unlockRewardsByPoints();
      await loadRewards();
      alert('Récompenses débloquées automatiquement !');
    } catch (err) {
      alert('Erreur lors du déblocage automatique');
    }
  };

  const filteredRewards = rewards.filter((r) =>
    categoryFilter === 'all' ? true : r.category === categoryFilter
  );

  const unlockedRewards = filteredRewards.filter((r) => r.unlocked);
  const lockedRewards = filteredRewards.filter((r) => !r.unlocked);

  if (loading) {
    return (
      <div className="rewards-container">
        <div className="loading">Chargement des récompenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewards-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <h1>🎁 Récompenses</h1>
        <p className="rewards-subtitle">
          Débloquez des récompenses exclusives en accomplissant des succès et en gagnant des points
        </p>
        {stats && (
          <div className="rewards-stats">
            <div className="stat-card">
              <span className="stat-value">{stats.unlocked}</span>
              <span className="stat-label">Débloquées</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.total - stats.unlocked}</span>
              <span className="stat-label">À débloquer</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {stats.total > 0 ? Math.round((stats.unlocked / stats.total) * 100) : 0}%
              </span>
              <span className="stat-label">Progression</span>
            </div>
          </div>
        )}
      </div>

      <div className="rewards-actions">
        <button className="btn-unlock-auto" onClick={handleUnlockRewardsByPoints}>
          🚀 Débloquer selon mes points
        </button>
      </div>

      <div className="category-filters">
        <button
          className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          Toutes
        </button>
        {Object.entries(categoryLabels).map(([cat, label]) => (
          <button
            key={cat}
            className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat as CategoryFilter)}
          >
            {categoryEmojis[cat]} {label}
          </button>
        ))}
      </div>

      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="category-stats">
          {stats.byCategory.map((cat) => (
            <div key={cat.category} className="category-stat">
              <span className="cat-emoji">{categoryEmojis[cat.category]}</span>
              <span className="cat-name">{categoryLabels[cat.category]}</span>
              <span className="cat-progress">
                {cat.unlocked}/{cat.total}
              </span>
            </div>
          ))}
        </div>
      )}

      {unlockedRewards.length > 0 && (
        <div className="rewards-section">
          <h2 className="section-title">✅ Débloquées ({unlockedRewards.length})</h2>
          <div className="rewards-grid">
            {unlockedRewards.map((reward) => (
              <div key={reward.id} className="reward-card unlocked">
                <div className="reward-icon">{reward.icon || categoryEmojis[reward.category]}</div>
                <div className="reward-category">{categoryLabels[reward.category]}</div>
                <h3 className="reward-title">{reward.title}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-footer">
                  <span className="reward-points">{reward.points_required} pts</span>
                  {reward.achievement_title && (
                    <span className="reward-achievement">🏆 {reward.achievement_title}</span>
                  )}
                </div>
                <div className="reward-status unlocked-status">Débloquée ✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedRewards.length > 0 && (
        <div className="rewards-section">
          <h2 className="section-title">🔒 À débloquer ({lockedRewards.length})</h2>
          <div className="rewards-grid">
            {lockedRewards.map((reward) => (
              <div key={reward.id} className="reward-card locked">
                <div className="reward-icon grayscale">
                  {reward.icon || categoryEmojis[reward.category]}
                </div>
                <div className="reward-category">{categoryLabels[reward.category]}</div>
                <h3 className="reward-title">{reward.title}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-footer">
                  <span className="reward-points">{reward.points_required} pts requis</span>
                  {reward.achievement_title && (
                    <span className="reward-achievement">🏆 {reward.achievement_title}</span>
                  )}
                </div>
                <div className="reward-status locked-status">À débloquer</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredRewards.length === 0 && (
        <div className="no-rewards">
          <p>Aucune récompense dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
