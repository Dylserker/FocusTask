-- Migration: Ajouter les colonnes manquantes à la table Settings
-- Date: 2026-01-12

USE FocusTask;

-- Ajouter les colonnes manquantes (ignorer les erreurs si elles existent déjà)
ALTER TABLE Settings ADD COLUMN email_notifications boolean default false;
ALTER TABLE Settings ADD COLUMN sound_effects boolean default true;
ALTER TABLE Settings ADD COLUMN daily_goal int default 5;

-- Vérifier la structure finale
SELECT 'Table Settings mise à jour avec succès' as status;
DESCRIBE Settings;
