import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const baseIcon = path.join(__dirname, '..', 'public', 'icon-base.svg');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Vérifier si le fichier SVG de base existe
if (!fs.existsSync(baseIcon)) {
  console.error(`❌ Le fichier ${baseIcon} n'existe pas.`);
  console.log('📝 Créez d\'abord un fichier icon-base.svg dans le dossier public/');
  process.exit(1);
}

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA...\n');

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(baseIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Généré: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Erreur lors de la génération de icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n✨ Génération terminée !');
}

generateIcons().catch(console.error);

