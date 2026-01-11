-- Script de test pour le système de récompenses
-- Ce script vérifie que toutes les récompenses sont bien installées

USE FocusTask;

-- ============================================
-- TEST 1 : Vérifier le nombre total de récompenses
-- ============================================
SELECT 
    '🎯 TEST 1: Nombre total de récompenses' AS Test,
    COUNT(*) AS Total,
    CASE 
        WHEN COUNT(*) = 30 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM Rewards;

-- ============================================
-- TEST 2 : Répartition par catégorie
-- ============================================
SELECT 
    '🎯 TEST 2: Répartition par catégorie' AS Test,
    category AS Categorie,
    COUNT(*) AS Nombre,
    CASE 
        WHEN category = 'title' AND COUNT(*) = 10 THEN '✅'
        WHEN category = 'avatar' AND COUNT(*) = 9 THEN '✅'
        WHEN category = 'template' AND COUNT(*) = 6 THEN '✅'
        WHEN category = 'theme' AND COUNT(*) = 5 THEN '✅'
        WHEN category = 'badge' AND COUNT(*) = 5 THEN '✅'
        WHEN category = 'feature' AND COUNT(*) = 3 THEN '✅'
        ELSE '❌'
    END AS Statut
FROM Rewards
GROUP BY category
ORDER BY COUNT(*) DESC;

-- ============================================
-- TEST 3 : Vérifier les liens avec les achievements
-- ============================================
SELECT 
    '🎯 TEST 3: Récompenses liées aux achievements' AS Test,
    COUNT(DISTINCT achievement_id) AS Achievements_lies,
    COUNT(*) AS Total_avec_lien,
    CASE 
        WHEN COUNT(DISTINCT achievement_id) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM Rewards
WHERE achievement_id IS NOT NULL;

-- ============================================
-- TEST 4 : Vérifier la plage de points
-- ============================================
SELECT 
    '🎯 TEST 4: Plage de points' AS Test,
    MIN(points_required) AS Points_min,
    MAX(points_required) AS Points_max,
    AVG(points_required) AS Points_moyen,
    CASE 
        WHEN MIN(points_required) >= 10 AND MAX(points_required) <= 2000 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM Rewards;

-- ============================================
-- TEST 5 : Vérifier l'existence du trigger
-- ============================================
SELECT 
    '🎯 TEST 5: Trigger de déblocage automatique' AS Test,
    TRIGGER_NAME AS Nom,
    EVENT_MANIPULATION AS Evenement,
    EVENT_OBJECT_TABLE AS Table_cible,
    CASE 
        WHEN TRIGGER_NAME = 'auto_unlock_achievement_reward' THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'FocusTask'
AND TRIGGER_NAME = 'auto_unlock_achievement_reward';

-- ============================================
-- TEST 6 : Vérifier l'existence de la procédure
-- ============================================
SELECT 
    '🎯 TEST 6: Procédure UnlockRewardsByPoints' AS Test,
    ROUTINE_NAME AS Nom,
    ROUTINE_TYPE AS Type,
    CASE 
        WHEN ROUTINE_NAME = 'UnlockRewardsByPoints' THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'FocusTask'
AND ROUTINE_NAME = 'UnlockRewardsByPoints';

-- ============================================
-- TEST 7 : Vérifier les vues
-- ============================================
SELECT 
    '🎯 TEST 7: Vues SQL' AS Test,
    TABLE_NAME AS Nom_vue,
    TABLE_TYPE AS Type,
    CASE 
        WHEN TABLE_NAME IN ('UserRewardsDetails', 'AvailableRewards') THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS Resultat
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'FocusTask'
AND TABLE_TYPE = 'VIEW'
AND TABLE_NAME IN ('UserRewardsDetails', 'AvailableRewards');

-- ============================================
-- TEST 8 : Lister quelques récompenses par catégorie
-- ============================================
SELECT 
    '🏆 APERÇU: Exemples de récompenses' AS Info,
    category AS Categorie,
    title AS Titre,
    points_required AS Points,
    CASE WHEN achievement_id IS NOT NULL THEN 'Oui' ELSE 'Non' END AS Achievement_lie
FROM Rewards
GROUP BY category, id
ORDER BY category, points_required
LIMIT 15;

-- ============================================
-- RÉSUMÉ FINAL
-- ============================================
SELECT 
    '📊 RÉSUMÉ FINAL' AS '',
    '' AS Statistiques,
    '' AS Valeurs;

SELECT 
    'Total Récompenses' AS Metrique,
    COUNT(*) AS Valeur
FROM Rewards
UNION ALL
SELECT 
    'Total Achievements',
    COUNT(*)
FROM Achievements
UNION ALL
SELECT 
    'Récompenses avec Achievement lié',
    COUNT(*)
FROM Rewards
WHERE achievement_id IS NOT NULL
UNION ALL
SELECT 
    'Catégories disponibles',
    COUNT(DISTINCT category)
FROM Rewards;

-- ============================================
-- Message de fin
-- ============================================
SELECT 
    '✅ Tests terminés !' AS '',
    'Consultez les résultats ci-dessus pour vérifier que tout fonctionne correctement.' AS Message;
