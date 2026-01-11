-- Script pour débloquer les succès manquants pour tous les utilisateurs
-- qui remplissent déjà les conditions

USE FocusTask;

DELIMITER //

-- Procédure pour débloquer tous les succès manquants d'un utilisateur
DROP PROCEDURE IF EXISTS UnlockMissingAchievements //

CREATE PROCEDURE UnlockMissingAchievements(IN p_user_id INT)
BEGIN
    DECLARE v_completed_count INT;
    DECLARE v_total_points INT;
    DECLARE v_current_streak INT;
    DECLARE v_user_level INT;
    DECLARE v_difficulty_count INT;
    DECLARE v_join_date DATE;
    DECLARE v_days_member INT;
    DECLARE v_completed_today BOOLEAN;
    DECLARE v_completed_time TIME;
    DECLARE v_current_hour INT;
    
    -- Récupérer les informations de l'utilisateur
    SELECT tasks_completed, total_points, current_streak, level, join_date
    INTO v_completed_count, v_total_points, v_current_streak, v_user_level, v_join_date
    FROM Users
    WHERE id = p_user_id;
    
    -- Calculer les jours depuis l'inscription
    SET v_days_member = DATEDIFF(CURDATE(), v_join_date);
    
    -- Débloquer les succès de tâches complétées
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'tasks_completed'
    AND v_completed_count >= a.condition_value;
    
    -- Débloquer les succès de points totaux
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'total_points'
    AND v_total_points >= a.condition_value;
    
    -- Débloquer les succès de streaks
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'streak'
    AND v_current_streak >= a.condition_value;
    
    -- Débloquer les succès de niveaux
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'level'
    AND v_user_level >= a.condition_value;
    
    -- Débloquer les succès de tâches difficiles complétées
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
    
    -- Débloquer les succès d'adhésion
    INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
    SELECT p_user_id, a.id
    FROM Achievements a
    WHERE a.condition_type = 'member_duration'
    AND v_days_member >= a.condition_value;
    
    -- Débloquer le succès "jour 1" si applicable
    IF v_days_member = 0 AND v_completed_count >= 1 THEN
        INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
        SELECT p_user_id, a.id
        FROM Achievements a
        WHERE a.condition_type = 'day_one'
        AND a.condition_value = 1;
    END IF;
    
    -- Débloquer les succès de vitesse (basés sur la dernière tâche complétée aujourd'hui)
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

END //

-- Procédure pour débloquer les succès manquants pour tous les utilisateurs
DROP PROCEDURE IF EXISTS UnlockMissingAchievementsForAll //

CREATE PROCEDURE UnlockMissingAchievementsForAll()
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_done BOOLEAN DEFAULT FALSE;
    DECLARE user_cursor CURSOR FOR SELECT id FROM Users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    OPEN user_cursor;
    user_loop: LOOP
        FETCH user_cursor INTO v_user_id;
        IF v_done THEN
            LEAVE user_loop;
        END IF;
        
        -- Débloquer les succès manquants pour cet utilisateur
        CALL UnlockMissingAchievements(v_user_id);
    END LOOP;
    CLOSE user_cursor;

END //

DELIMITER ;

-- ============================================
-- EXÉCUTION - Débloquer tous les succès manquants
-- ============================================

-- Option 1 : Pour un utilisateur spécifique (remplacer 1 par l'ID utilisateur)
-- CALL UnlockMissingAchievements(1);

-- Option 2 : Pour tous les utilisateurs
CALL UnlockMissingAchievementsForAll();

-- Afficher le résumé
SELECT 
    u.id,
    u.username,
    u.tasks_completed,
    u.total_points,
    u.current_streak,
    u.level,
    COUNT(ua.achievement_id) as achievements_unlocked
FROM Users u
LEFT JOIN UserAchievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.tasks_completed, u.total_points, u.current_streak, u.level
ORDER BY u.id;
