import './Home.css';

const updates = [
  {
    date: '08/01/2026',
    title: 'Navigation verticale',
    description: 'Ajout d’une barre latérale pour une navigation plus rapide.',
  },
  {
    date: '07/01/2026',
    title: 'Pages de base',
    description: 'Création des pages Login, Register, Tasks, Achievements, Profile, Settings.',
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>FocusTask</h1>
        <p>Organisez vos tâches, suivez vos progrès, atteignez vos objectifs</p>
        {/* CTA retirés à la demande : pas de boutons Connexion/Inscription */}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📝 Gestion de tâches</h3>
          <p>Créez et organisez vos tâches efficacement</p>
        </div>
        <div className="feature-card">
          <h3>🏆 Récompenses</h3>
          <p>Débloquez des succès en accomplissant vos objectifs</p>
        </div>
        <div className="feature-card">
          <h3>📊 Suivi de progression</h3>
          <p>Visualisez vos progrès et restez motivé</p>
        </div>
      </section>

      <section className="updates">
        <div className="updates-header">
          <h2>Mises à jour</h2>
          <span className="badge">Journal</span>
        </div>
        <div className="updates-list">
          {updates.map((u, idx) => (
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
        <h2>À propos</h2>
        <p>
          FocusTask est une application minimaliste pour rester concentré sur vos objectifs
          quotidiens. Ajoutez des tâches, suivez vos progrès et célébrez vos succès.
        </p>
      </section>
    </div>
  );
};

export default Home;
