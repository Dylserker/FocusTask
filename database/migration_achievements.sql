-- Migration pour créer une liste complète de succès avec conditions variées
-- Exécuter ce script après FocusTask.sql

USE FocusTask;

-- Vider les succès existants (optionnel - décommenter si nécessaire)
-- DELETE FROM UserAchievements;
-- DELETE FROM Achievements;
-- ALTER TABLE Achievements AUTO_INCREMENT = 1;

-- ============================================
-- SUCCÈS - Tâches
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Première Tâche', 'Créez et complétez votre première tâche', '🎯', 'tasks_completed', 1, 10),
('Productif', 'Complétez 10 tâches', '⚡', 'tasks_completed', 10, 50),
('En Route', 'Complétez 25 tâches', '🚀', 'tasks_completed', 25, 100),
('Marathonien', 'Complétez 50 tâches', '🏃', 'tasks_completed', 50, 150),
('Centenaire', 'Complétez 100 tâches', '💯', 'tasks_completed', 100, 300),
('Mille et Une', 'Complétez 250 tâches', '🌟', 'tasks_completed', 250, 500),
('Légendaire', 'Complétez 500 tâches', '👑', 'tasks_completed', 500, 1000);

-- ============================================
-- SUCCÈS - Difficultés
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Premier Défi', 'Complétez une tâche difficile', '🔥', 'difficult_completed', 1, 75),
('Dompteur de Feu', 'Complétez 10 tâches difficiles', '🔥🔥', 'difficult_completed', 10, 250),
('Maître des Défis', 'Complétez 25 tâches difficiles', '🔥🔥🔥', 'difficult_completed', 25, 500);

-- ============================================
-- SUCCÈS - Points
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Premiers Points', 'Gagnez 100 points au total', '💰', 'total_points', 100, 25),
('Riche', 'Gagnez 500 points au total', '💎', 'total_points', 500, 100),
('Très Riche', 'Gagnez 1000 points au total', '💎💎', 'total_points', 1000, 250),
('Fortunes', 'Gagnez 5000 points au total', '👑💎', 'total_points', 5000, 1000);

-- ============================================
-- SUCCÈS - Streaks (Séries)
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Début de Série', 'Complétez des tâches 3 jours de suite', '🔗', 'streak', 3, 50),
('Semaine Parfaite', 'Complétez des tâches 7 jours de suite', '⭐', 'streak', 7, 200),
('Deux Semaines', 'Complétez des tâches 14 jours de suite', '⭐⭐', 'streak', 14, 400),
('Un Mois', 'Complétez des tâches 30 jours de suite', '📅', 'streak', 30, 1000),
('Infatigable', 'Complétez des tâches 60 jours de suite', '♾️', 'streak', 60, 2000);

-- ============================================
-- SUCCÈS - Niveaux
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Chercheur', 'Atteindre le niveau 5', '📚', 'level', 5, 100),
('Aventurier', 'Atteindre le niveau 10', '🗺️', 'level', 10, 250),
('Sage', 'Atteindre le niveau 20', '🧙', 'level', 20, 500),
('Titan', 'Atteindre le niveau 50', '⚔️', 'level', 50, 2000);

-- ============================================
-- SUCCÈS - Vitesse (Temps)
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Matinal', 'Complétez une tâche avant 8h du matin', '🌅', 'time_based', 8, 30),
('Noctambule', 'Complétez une tâche après 22h', '🌙', 'time_based', 22, 30);

-- ============================================
-- SUCCÈS - Spéciaux (Temps depuis inscription)
-- ============================================
INSERT IGNORE INTO Achievements (title, description, icon, condition_type, condition_value, points_reward) VALUES
('Bienvenue!', 'Complétez votre première tâche le jour de votre inscription', '🎉', 'day_one', 1, 15),
('Un Mois avec Nous', 'Soyez inscrit depuis 30 jours', '📆', 'member_duration', 30, 50),
('Six Mois avec Nous', 'Soyez inscrit depuis 180 jours', '📆📆', 'member_duration', 180, 200),
('Un An avec Nous', 'Soyez inscrit depuis 365 jours', '🎂', 'member_duration', 365, 500);

-- ============================================
-- Amélioration de la procédure CheckAchievements
-- ============================================
DELIMITER //

DROP PROCEDURE IF EXISTS CheckAchievements //

CREATE PROCEDURE CheckAchievements(IN p_user_id INT)
BEGIN
    DECLARE v_completed_count INT;
    DECLARE v_total_points INT;
    DECLARE v_current_streak INT;
    DECLARE v_user_level INT;
    DECLARE v_difficulty_count INT;
    DECLARE v_join_date DATE;
    DECLARE v_days_member INT;
    DECLARE v_has_completed_today BOOLEAN;
    DECLARE v_completed_time TIME;
    DECLARE v_current_hour INT;
    
    -- Récupérer les informations de l'utilisateur
    SELECT tasks_completed, total_points, current_streak, level, join_date
    INTO v_completed_count, v_total_points, v_current_streak, v_user_level, v_join_date
    FROM Users
    WHERE id = p_user_id;
    
    -- Calculer les jours depuis l'inscription
    SET v_days_member = DATEDIFF(CURDATE(), v_join_date);
    
    -- ========== SUCCÈS DE TÂCHES COMPLÉTÉES ==========
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'tasks_completed'
    AND v_completed_count >= a.condition_value;
    
    -- ========== SUCCÈS DE POINTS TOTAUX ==========
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'total_points'
    AND v_total_points >= a.condition_value;
    
    -- ========== SUCCÈS DE STREAKS ==========
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'streak'
    AND v_current_streak >= a.condition_value;
    
    -- ========== SUCCÈS DE NIVEAUX ==========
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'level'
    AND v_user_level >= a.condition_value;
    
    -- ========== SUCCÈS DE TÂCHES DIFFICILES COMPLÉTÉES ==========
    SELECT COUNT(*) INTO v_difficulty_count
    FROM Tasks
    WHERE user_id = p_user_id
    AND difficulty = 'difficile'
    AND completed = TRUE;
    
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'difficult_completed'
    AND v_difficulty_count >= a.condition_value;
    
    -- ========== SUCCÈS BASÉS SUR LE TEMPS (MATINAL/NOCTAMBULE) ==========
    SELECT TIME(MAX(completed_at)) INTO v_completed_time
    FROM Tasks
    WHERE user_id = p_user_id
    AND completed = TRUE
    AND DATE(completed_at) = CURDATE();
    
    IF v_completed_time IS NOT NULL THEN
        SET v_current_hour = HOUR(v_completed_time);
        
        -- Matinal (avant 8h)
        INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
        SELECT p_user_id, a.id
        FROM Achievements a
        WHERE a.condition_type = 'time_based'
        AND a.condition_value = 8
        AND v_current_hour < 8;
        
        -- Noctambule (après 22h)
        INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
        SELECT p_user_id, a.id
        FROM Achievements a
        WHERE a.condition_type = 'time_based'
        AND a.condition_value = 22
        AND v_current_hour >= 22;
    END IF;
    
    -- ========== SUCCÈS D'ADHÉSION ==========
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'member_duration'
    AND v_days_member >= a.condition_value;
    
    -- ========== SUCCÈS "JOUR 1" ==========
    IF v_days_member = 0 AND v_completed_count >= 1 THEN
        INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
        SELECT p_user_id, a.id
        FROM Achievements a
        WHERE a.condition_type = 'day_one'
        AND a.condition_value = 1;
    END IF;

END //

DELIMITER ;

-- ============================================
-- Trigger pour mettre à jour les points de récompense des achievements
-- ============================================
DELIMITER //

DROP TRIGGER IF EXISTS after_achievement_unlocked //

CREATE TRIGGER after_achievement_unlocked
AFTER INSERT ON UserAchievements
FOR EACH ROW
BEGIN
    DECLARE v_points_reward INT;
    
    -- Récupérer les points de récompense de l'achievement
    SELECT points_reward INTO v_points_reward
    FROM Achievements
    WHERE id = NEW.achievement_id;
    
    -- Ajouter les points à l'utilisateur
    IF v_points_reward > 0 THEN
        UPDATE Users
        SET total_points = total_points + v_points_reward,
            experience_points = experience_points + (v_points_reward / 2)
        WHERE id = NEW.user_id;
    END IF;
END //

DELIMITER ;

-- ============================================
-- Fonction utilitaire pour vérifier les achievements d'un utilisateur
-- ============================================
DELIMITER //

DROP PROCEDURE IF EXISTS GetUserAchievementProgress //

CREATE PROCEDURE GetUserAchievementProgress(IN p_user_id INT)
BEGIN
    SELECT
        (SELECT COUNT(*) FROM UserAchievements WHERE user_id = p_user_id) as unlocked,
        (SELECT COUNT(*) FROM Achievements) as total,
        ROUND(100 * (SELECT COUNT(*) FROM UserAchievements WHERE user_id = p_user_id) / (SELECT COUNT(*) FROM Achievements), 2) as percentage;
END //

DELIMITER ;
