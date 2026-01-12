-- Ajout de la colonne template pour mémoriser la préférence de modèle d'interface
ALTER TABLE Settings
  ADD COLUMN template VARCHAR(50) NULL DEFAULT NULL;
