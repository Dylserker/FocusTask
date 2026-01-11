-- Migration pour créer 30 récompenses liées aux achievements
-- Ces récompenses incluent des titres, des photos de profil, des templates, etc.

USE FocusTask;

-- Vider les récompenses existantes (optionnel)
-- DELETE FROM UserRewards;
-- DELETE FROM Rewards;
-- ALTER TABLE Rewards AUTO_INCREMENT = 1;

-- ============================================
-- TABLE DES RÉCOMPENSES
-- ============================================

-- Supprimer les anciennes tables si elles existent
DROP TABLE IF EXISTS UserRewards;
DROP TABLE IF EXISTS Rewards;

CREATE TABLE Rewards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('title', 'avatar', 'template', 'theme', 'badge', 'feature') NOT NULL,
    icon TEXT,
    points_required INT NOT NULL DEFAULT 0,
    achievement_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (achievement_id) REFERENCES Achievements(id) ON DELETE SET NULL
);

CREATE TABLE UserRewards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    reward_id INT UNSIGNED NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES Rewards(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reward (user_id, reward_id)
);

-- ============================================
-- RÉCOMPENSES - TITRES (Liés aux Achievements)
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Titres débutants (0-100 points)
('Novice', 'Votre premier titre. Montrez que vous avez commencé votre aventure.', 'title', '🌱', 10, 1),
('Débutant Motivé', 'Un titre pour ceux qui prennent leur productivité au sérieux.', 'title', '💪', 50, 2),
('Organisateur', 'Vous savez gérer vos tâches efficacement.', 'title', '📋', 100, 21),

-- Titres intermédiaires (100-500 points)
('Sprint Master', 'Pour les marathoniens de la productivité.', 'title', '🏃‍♂️', 150, 3),
('Perfectionniste', 'Vous visez toujours l\'excellence.', 'title', '✨', 300, 22),
('Stratège', 'Un maître de la planification stratégique.', 'title', '🎯', 500, 23),

-- Titres avancés (500+ points)
('Légende Vivante', 'Votre productivité est légendaire.', 'title', '👑', 1000, 24),
('Maître du Feu', 'Vous domptez les défis les plus ardus.', 'title', '🔥', 250, 28),
('Grand Sage', 'Votre sagesse en productivité inspire tous.', 'title', '🧙‍♂️', 500, 42),
('Titan Infatigable', 'Rien ne peut arrêter votre progression.', 'title', '⚔️', 2000, 43);

-- ============================================
-- RÉCOMPENSES - AVATARS / PHOTOS DE PROFIL
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Avatars débutants
('Avatar Étoile', 'Un avatar brillant pour commencer votre aventure.', 'avatar', '⭐', 25, 1),
('Avatar Fusée', 'Décollage vers la productivité !', 'avatar', '🚀', 100, 21),
('Avatar Diamant', 'Brillez comme un diamant.', 'avatar', '💎', 250, 32),

-- Avatars intermédiaires
('Avatar Phoenix', 'Renaissez de vos cendres chaque jour.', 'avatar', '🦅', 500, 23),
('Avatar Couronne', 'Portez la couronne de la productivité.', 'avatar', '👑', 1000, 24),
('Avatar Dragon', 'Puissant et majestueux.', 'avatar', '🐉', 1500, 30),

-- Avatars avancés
('Avatar Galaxie', 'L\'infini à portée de main.', 'avatar', '🌌', 2000, 43),
('Avatar Licorne', 'Rare et magique, comme votre productivité.', 'avatar', '🦄', 1000, 37),
('Avatar Trophée', 'Le symbole ultime de la victoire.', 'avatar', '🏆', 2000, 43);

-- ============================================
-- RÉCOMPENSES - TEMPLATES / MODÈLES
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Templates de tâches
('Template Focus', 'Modèle de tâche pour sessions de concentration profonde.', 'template', '🎯', 50, 2),
('Template Sprint', 'Modèle pour sprints de productivité rapides.', 'template', '⚡', 150, 3),
('Template Projet', 'Modèle pour gérer des projets complexes.', 'template', '📊', 300, 22),

-- Templates de journées
('Template Matinal', 'Routine matinale pour démarrer du bon pied.', 'template', '🌅', 30, 6),
('Template Semaine', 'Planification hebdomadaire optimisée.', 'template', '📅', 200, 35),
('Template Objectifs', 'Définissez et atteignez vos objectifs mensuels.', 'template', '🎯', 500, 23);

-- ============================================
-- RÉCOMPENSES - THÈMES
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Thèmes de couleurs
('Thème Midnight', 'Interface sombre et élégante pour travailler la nuit.', 'theme', '🌙', 100, 44),
('Thème Aurora', 'Couleurs inspirées des aurores boréales.', 'theme', '🌈', 200, 35),
('Thème Forest', 'Des tons apaisants de vert forêt.', 'theme', '🌲', 300, 22),
('Thème Ocean', 'Bleu profond et relaxant comme l\'océan.', 'theme', '🌊', 400, 37),
('Thème Golden', 'Luxe et élégance en or.', 'theme', '✨', 1000, 24);

-- ============================================
-- RÉCOMPENSES - BADGES
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Badges spéciaux
('Badge Premier Pas', 'Votre premier badge de réussite.', 'badge', '🥉', 10, 1),
('Badge Série', 'Pour votre constance quotidienne.', 'badge', '🔗', 50, 35),
('Badge Vitesse', 'Tâches complétées à vitesse éclair.', 'badge', '⚡', 200, 3),
('Badge Excellence', 'Pour votre quête d\'excellence.', 'badge', '🥇', 500, 23),
('Badge Légende', 'Vous êtes entré dans la légende.', 'badge', '🏅', 1000, 24);

-- ============================================
-- RÉCOMPENSES - FONCTIONNALITÉS
-- ============================================

INSERT INTO Rewards (title, description, category, icon, points_required, achievement_id) VALUES
-- Features débloquables
('Statistiques Avancées', 'Accédez à des statistiques détaillées de productivité.', 'feature', '📊', 150, 3),
('Mode Focus', 'Activez le mode concentration sans distraction.', 'feature', '🎯', 300, 22),
('Export de Données', 'Exportez vos tâches et statistiques.', 'feature', '💾', 500, 23);

-- ============================================
-- TRIGGER - Déblocage automatique des récompenses
-- ============================================

DELIMITER //

DROP TRIGGER IF EXISTS auto_unlock_achievement_reward //

CREATE TRIGGER auto_unlock_achievement_reward
AFTER INSERT ON UserAchievements
FOR EACH ROW
BEGIN
    -- Débloquer automatiquement la récompense liée à l'achievement
    INSERT IGNORE INTO UserRewards (user_id, reward_id)
    SELECT NEW.user_id, r.id
    FROM Rewards r
    WHERE r.achievement_id = NEW.achievement_id;
END //

DELIMITER ;

-- ============================================
-- PROCÉDURE - Débloquer les récompenses selon les points
-- ============================================

DELIMITER //

DROP PROCEDURE IF EXISTS UnlockRewardsByPoints //

CREATE PROCEDURE UnlockRewardsByPoints(IN p_user_id INT)
BEGIN
    DECLARE v_total_points INT;
    
    -- Récupérer les points totaux de l'utilisateur
    SELECT total_points INTO v_total_points
    FROM Users
    WHERE id = p_user_id;
    
    -- Débloquer toutes les récompenses accessibles avec les points actuels
    INSERT IGNORE INTO UserRewards (user_id, reward_id)
    SELECT p_user_id, r.id
    FROM Rewards r
    WHERE r.points_required <= v_total_points
    AND r.achievement_id IS NULL; -- Seulement les récompenses non liées à des achievements
    
END //

DELIMITER ;

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour les récompenses d'un utilisateur avec détails
CREATE OR REPLACE VIEW UserRewardsDetails AS
SELECT 
    ur.user_id,
    ur.reward_id,
    r.title,
    r.description,
    r.category,
    r.icon,
    r.points_required,
    ur.unlocked_at,
    a.title AS achievement_title
FROM UserRewards ur
JOIN Rewards r ON ur.reward_id = r.id
LEFT JOIN Achievements a ON r.achievement_id = a.id;

-- Vue pour les récompenses disponibles (non débloquées)
CREATE OR REPLACE VIEW AvailableRewards AS
SELECT 
    u.id AS user_id,
    r.id AS reward_id,
    r.title,
    r.description,
    r.category,
    r.icon,
    r.points_required,
    u.total_points,
    CASE 
        WHEN r.points_required <= u.total_points THEN 'affordable'
        ELSE 'too_expensive'
    END AS affordability_status
FROM Users u
CROSS JOIN Rewards r
WHERE NOT EXISTS (
    SELECT 1 FROM UserRewards ur 
    WHERE ur.user_id = u.id AND ur.reward_id = r.id
);

-- ============================================
-- INDEX pour améliorer les performances
-- ============================================

CREATE INDEX idx_rewards_category ON Rewards(category);
CREATE INDEX idx_rewards_points ON Rewards(points_required);
CREATE INDEX idx_rewards_achievement ON Rewards(achievement_id);
CREATE INDEX idx_user_rewards_user ON UserRewards(user_id);
CREATE INDEX idx_user_rewards_reward ON UserRewards(reward_id);
