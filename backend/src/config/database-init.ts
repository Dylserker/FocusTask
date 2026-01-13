import pool from '../config/database';

/**
 * Attend que la base de données soit disponible
 */
async function waitForDatabase(maxRetries = 30, delayMs = 1000): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Connexion à la base de données établie');
      return;
    } catch (error: any) {
      console.log(`⏳ Attente de la base de données... (tentative ${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        throw new Error(`Impossible de se connecter à la base de données après ${maxRetries} tentatives`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Initialise la structure de la base de données
 * Ajoute les colonnes manquantes à la table Settings si elles n'existent pas
 */
export async function initializeDatabase() {
  try {
    console.log('🔧 Initialisation de la structure de base de données...');

    // Attendre que la base de données soit disponible
    await waitForDatabase();

    // Ajouter les colonnes manquantes à la table Settings
    const migrations = [
      {
        name: 'email_notifications',
        sql: 'ALTER TABLE Settings ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT FALSE',
      },
      {
        name: 'sound_effects',
        sql: 'ALTER TABLE Settings ADD COLUMN IF NOT EXISTS sound_effects BOOLEAN DEFAULT TRUE',
      },
      {
        name: 'daily_goal',
        sql: 'ALTER TABLE Settings ADD COLUMN IF NOT EXISTS daily_goal INT DEFAULT 5',
      },
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration.sql);
        console.log(`✅ Colonne '${migration.name}' vérifiée/créée`);
      } catch (error: any) {
        // Ignorer l'erreur si la colonne existe déjà
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.warn(`⚠️ Impossible d'ajouter '${migration.name}':`, error.message);
        }
      }
    }

    console.log('✅ Initialisation de la base de données terminée\n');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
}
