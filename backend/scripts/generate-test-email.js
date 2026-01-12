#!/usr/bin/env node

/**
 * Script de test pour la fonctionnalité d'envoi d'email
 * 
 * Ce script génère automatiquement un compte Ethereal Email
 * et affiche la configuration à ajouter dans votre .env
 */

const nodemailer = require('nodemailer');

async function generateTestEmailAccount() {
  console.log('\n🔧 Génération d\'un compte email de test Ethereal...\n');

  try {
    // Créer un compte de test
    const testAccount = await nodemailer.createTestAccount();

    console.log('✅ Compte de test créé avec succès!\n');
    console.log('📧 Informations du compte:');
    console.log('─────────────────────────────────────────────');
    console.log(`Email: ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    console.log(`SMTP Host: ${testAccount.smtp.host}`);
    console.log(`SMTP Port: ${testAccount.smtp.port}`);
    console.log('─────────────────────────────────────────────\n');

    console.log('📝 Configuration pour votre fichier .env:');
    console.log('─────────────────────────────────────────────');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`SMTP_FROM="FocusTask" <noreply@focustask.com>`);
    console.log('─────────────────────────────────────────────\n');

    console.log('🌐 Pour voir les emails envoyés:');
    console.log(`   https://ethereal.email/login`);
    console.log(`   Username: ${testAccount.user}`);
    console.log(`   Password: ${testAccount.pass}\n`);

    console.log('💡 Astuce: Les emails ne seront pas vraiment envoyés.');
    console.log('   Vous pourrez les consulter sur le site Ethereal.\n');

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte:', error.message);
    process.exit(1);
  }
}

generateTestEmailAccount();
