import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <div className="home-container">
      <section className="hero">
        <h1>{t('home.heroTitle')}</h1>
        <p>{t('home.heroSubtitle')}</p>
        {/* CTA retirés à la demande : pas de boutons Connexion/Inscription */}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>{t('home.features.tasksTitle')}</h3>
          <p>{t('home.features.tasksDesc')}</p>
        </div>
        <div className="feature-card">
          <h3>{t('home.features.rewardsTitle')}</h3>
          <p>{t('home.features.rewardsDesc')}</p>
        </div>
        <div className="feature-card">
          <h3>{t('home.features.progressTitle')}</h3>
          <p>{t('home.features.progressDesc')}</p>
        </div>
      </section>

      <section className="updates">
        <div className="updates-header">
          <h2>{t('home.updates.title')}</h2>
          <span className="badge">{t('home.updates.badge')}</span>
        </div>
        <div className="updates-list">
          {(t('home.updates.items', { returnObjects: true }) as Array<{ date: string; title: string; description: string }>).map((u, idx) => (
            <article key={idx} className="update-card">
              <div className="update-meta">
                <span className="update-date">{u.date}</span>
              </div>
              <h3 className="update-title">{u.title}</h3>
              <p className="update-desc">{u.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about">
        <h2>{t('home.about.title')}</h2>
        <p>
          {t('home.about.description')}
        </p>
      </section>
    </div>
  );
};

export default Home;
