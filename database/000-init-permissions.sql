-- Script d'initialisation pour configurer les permissions MySQL
-- Ce script DOIT être exécuté en premier (nom: 000-init-permissions.sql)

-- Modifier root@'%' qui est créé automatiquement par MYSQL_ROOT_HOST='%'
ALTER USER 'root'@'%' IDENTIFIED BY '0000';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Créer un utilisateur spécifique pour FocusTask (recommandé pour la production)
CREATE USER IF NOT EXISTS 'focustask'@'%' IDENTIFIED BY '0000';
GRANT ALL PRIVILEGES ON FocusTask.* TO 'focustask'@'%';

FLUSH PRIVILEGES;

SELECT 'Permissions MySQL configurées avec succès' as status;
