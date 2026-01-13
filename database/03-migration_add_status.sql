-- Migration: Ajouter support pour 3 états de tâche
-- Ce script ajoute une colonne 'status' qui supportera 3 états: pending, in_progress, completed

-- Ajouter la colonne status si elle n'existe pas
ALTER TABLE Tasks ADD COLUMN status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending' AFTER completed;

-- Migrer les données existantes
-- Si completed = true, alors status = 'completed'
-- Si completed = false, alors status = 'pending'
UPDATE Tasks SET status = CASE 
    WHEN completed = true THEN 'completed'
    ELSE 'pending'
END;

-- Créer un index sur le nouveau champ
ALTER TABLE Tasks ADD INDEX idx_status (user_id, status);

-- Optionnel: Ajouter un trigger pour synchroniser 'completed' et 'status' à chaque mise à jour
-- Cela permet de garder les deux colonnes synchronisées
DELIMITER $$

CREATE TRIGGER task_status_sync_update 
BEFORE UPDATE ON Tasks 
FOR EACH ROW 
BEGIN
    -- Si status change, mettre à jour completed en conséquence
    IF NEW.status = 'completed' THEN
        SET NEW.completed = true;
    ELSE
        SET NEW.completed = false;
    END IF;
END$$

DELIMITER ;
