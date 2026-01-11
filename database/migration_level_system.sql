-- Migration: Système de niveaux automatique
-- Date: 2026-01-11
-- Description: Ajout de fonctions SQL et triggers pour calculer automatiquement
--              le niveau et le pourcentage d'XP basé sur experience_points

USE FocusTask;

-- ============================================
-- Système de niveaux basé sur l'XP
-- ============================================
-- Formule: Niveau N nécessite N*100 XP pour passer au niveau suivant
-- XP total pour atteindre niveau N = 50 * N * (N - 1)
-- Exemples:
--   Niveau 1: 0-99 XP
--   Niveau 2: 100-299 XP (besoin de 100 XP)
--   Niveau 3: 300-599 XP (besoin de 200 XP)
--   Niveau 4: 600-999 XP (besoin de 300 XP)
-- ============================================

DELIMITER $$

-- Fonction pour calculer le niveau basé sur l'XP total
DROP FUNCTION IF EXISTS calculate_level$$
CREATE FUNCTION calculate_level(xp INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE level_value INT;
    -- Formule inversée: niveau = (1 + sqrt(1 + 8*xp/100)) / 2
    SET level_value = FLOOR((1 + SQRT(1 + 8 * xp / 100)) / 2);
    -- Le niveau minimum est 1
    IF level_value < 1 THEN
        SET level_value = 1;
    END IF;
    RETURN level_value;
END$$

-- Fonction pour calculer l'XP total nécessaire pour atteindre un niveau
DROP FUNCTION IF EXISTS xp_for_level$$
CREATE FUNCTION xp_for_level(level_num INT) RETURNS INT
DETERMINISTIC
BEGIN
    -- XP total pour atteindre niveau N = 50 * N * (N - 1)
    RETURN 50 * level_num * (level_num - 1);
END$$

-- Fonction pour calculer le pourcentage de progression vers le niveau suivant
DROP FUNCTION IF EXISTS calculate_level_percent$$
CREATE FUNCTION calculate_level_percent(xp INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE current_level INT;
    DECLARE xp_for_current INT;
    DECLARE xp_for_next INT;
    DECLARE xp_in_level INT;
    DECLARE xp_needed INT;
    DECLARE percent_value INT;
    
    SET current_level = calculate_level(xp);
    SET xp_for_current = xp_for_level(current_level);
    SET xp_for_next = xp_for_level(current_level + 1);
    SET xp_in_level = xp - xp_for_current;
    SET xp_needed = xp_for_next - xp_for_current;
    
    IF xp_needed > 0 THEN
        SET percent_value = FLOOR(100 * xp_in_level / xp_needed);
    ELSE
        SET percent_value = 0;
    END IF;
    
    RETURN percent_value;
END$$

-- Trigger pour mettre à jour automatiquement le niveau lors d'un UPDATE
DROP TRIGGER IF EXISTS update_user_level$$
CREATE TRIGGER update_user_level
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    -- Mettre à jour le niveau et le pourcentage basé sur experience_points
    IF NEW.experience_points != OLD.experience_points THEN
        SET NEW.level = calculate_level(NEW.experience_points);
        SET NEW.experience_percent = calculate_level_percent(NEW.experience_points);
    END IF;
END$$

-- Trigger pour initialiser le niveau lors d'un INSERT
DROP TRIGGER IF EXISTS insert_user_level$$
CREATE TRIGGER insert_user_level
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    -- Initialiser le niveau et le pourcentage lors de la création
    SET NEW.level = calculate_level(NEW.experience_points);
    SET NEW.experience_percent = calculate_level_percent(NEW.experience_points);
END$$

DELIMITER ;

-- Mettre à jour tous les utilisateurs existants pour recalculer leur niveau
UPDATE Users SET experience_points = experience_points;

SELECT 'Migration terminée!' as status;
SELECT 
    id, 
    username, 
    experience_points as xp, 
    level, 
    experience_percent as percent,
    xp_for_level(level + 1) as xp_next_level
FROM Users;
