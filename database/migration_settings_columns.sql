-- Migration: Ajouter les colonnes manquantes à la table Settings
-- Date: 2026-01-12

USE FocusTask;

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE Settings ADD COLUMN IF NOT EXISTS email_notifications boolean default false;
ALTER TABLE Settings ADD COLUMN IF NOT EXISTS sound_effects boolean default true;
ALTER TABLE Settings ADD COLUMN IF NOT EXISTS daily_goal int default 5;

-- Vérifier la structure finale
SELECT 'Table Settings mise à jour avec succès' as status;
DESCRIBE Settings;
