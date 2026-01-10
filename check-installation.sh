#!/bin/bash

# Script de vérification de l'installation
# Usage: bash check-installation.sh

echo "🔍 Vérification de l'installation FocusTask..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
SUCCESS=0
FAILED=0

# Fonction de vérification
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

# 1. Vérifier Node.js
echo "📦 Vérification des prérequis..."
node --version > /dev/null 2>&1
check $? "Node.js installé"

npm --version > /dev/null 2>&1
check $? "npm installé"

# 2. Vérifier MySQL
mysql --version > /dev/null 2>&1
check $? "MySQL installé"

echo ""
echo "📁 Vérification de la structure du projet..."

# 3. Vérifier les fichiers backend
[ -f "backend/package.json" ]
check $? "backend/package.json existe"

[ -f "backend/.env.example" ]
check $? "backend/.env.example existe"

[ -f "backend/src/index.ts" ]
check $? "backend/src/index.ts existe"

[ -d "backend/node_modules" ]
check $? "backend/node_modules existe (dépendances installées)"

# 4. Vérifier les fichiers frontend
[ -f "frontend/package.json" ]
check $? "frontend/package.json existe"

[ -f "frontend/.env.example" ]
check $? "frontend/.env.example existe"

[ -f "frontend/vite.config.ts" ]
check $? "frontend/vite.config.ts existe"

[ -d "frontend/node_modules" ]
check $? "frontend/node_modules existe (dépendances installées)"

echo ""
echo "🔌 Vérification des services créés..."

# 5. Vérifier les services frontend
[ -f "frontend/src/services/api.ts" ]
check $? "Service API créé"

[ -f "frontend/src/services/authService.ts" ]
check $? "Service Auth créé"

[ -f "frontend/src/services/taskService.ts" ]
check $? "Service Task créé"

[ -f "frontend/src/services/achievementService.ts" ]
check $? "Service Achievement créé"

[ -f "frontend/src/services/rewardService.ts" ]
check $? "Service Reward créé"

[ -f "frontend/src/services/userService.ts" ]
check $? "Service User créé"

# 6. Vérifier les hooks
[ -f "frontend/src/hooks/useApi.ts" ]
check $? "Hook useApi créé"

# 7. Vérifier le context
[ -f "frontend/src/context/AuthContext.tsx" ]
check $? "AuthContext existe"

echo ""
echo "📚 Vérification de la documentation..."

# 8. Vérifier la documentation
[ -f "README.md" ]
check $? "README.md existe"

[ -f "SETUP.md" ]
check $? "SETUP.md existe"

[ -f "INTEGRATION.md" ]
check $? "INTEGRATION.md existe"

[ -f "SUMMARY.md" ]
check $? "SUMMARY.md existe"

[ -f "COMMANDS.md" ]
check $? "COMMANDS.md existe"

echo ""
echo "⚙️  Vérification de la configuration..."

# 9. Vérifier les fichiers de configuration
[ -f "backend/.env" ] || [ -f "backend/.env.example" ]
check $? "Configuration backend présente"

[ -f "frontend/.env" ] || [ -f "frontend/.env.example" ]
check $? "Configuration frontend présente"

# 10. Vérifier que .env n'est pas tracké par git
if [ -f ".gitignore" ]; then
    grep -q "\.env" .gitignore
    check $? ".env ignoré par git"
fi

echo ""
echo "🗄️  Vérification de la base de données..."

# 11. Vérifier le fichier SQL
[ -f "database/FocusTask.sql" ]
check $? "Schéma SQL existe"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé:"
echo -e "${GREEN}✓ Succès: $SUCCESS${NC}"
echo -e "${RED}✗ Échecs: $FAILED${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Tout est prêt ! Vous pouvez démarrer l'application.${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. cd backend && npm run dev"
    echo "2. cd frontend && npm run dev"
    echo "3. Ouvrir http://localhost:5173"
else
    echo ""
    echo -e "${YELLOW}⚠️  Certaines vérifications ont échoué.${NC}"
    echo ""
    echo "Actions recommandées:"
    echo "1. Installer les dépendances manquantes"
    echo "2. Vérifier les fichiers de configuration"
    echo "3. Consulter SETUP.md pour plus d'informations"
fi

echo ""
exit $FAILED
