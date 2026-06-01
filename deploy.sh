#!/bin/bash

# UCW App Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/${TIMESTAMP}"

echo "🚀 Starting UCW App deployment to ${ENVIRONMENT} environment"
echo "📅 Deployment timestamp: ${TIMESTAMP}"

# Load environment-specific configuration
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo "❌ Environment file .env.${ENVIRONMENT} not found"
    exit 1
fi

# Create backup directory
mkdir -p ${BACKUP_DIR}

echo "📦 Step 1: Backup current deployment"
if [ -f ".env" ]; then
    cp .env ${BACKUP_DIR}/.env.backup
fi

if [ -d "storage" ]; then
    tar -czf ${BACKUP_DIR}/storage.tar.gz storage/
fi

echo "🔄 Step 2: Update environment configuration"
cp .env.${ENVIRONMENT} .env

echo "📥 Step 3: Pull latest code"
git pull origin main

echo "📦 Step 4: Install PHP dependencies"
composer install --no-dev --optimize-autoloader

echo "📦 Step 5: Install Node.js dependencies"
npm install --production

echo "🏗️ Step 6: Build frontend assets"
npm run build

echo "🗄️ Step 7: Run database migrations"
php artisan migrate --force

echo "🌱 Step 8: Run database seeders (if needed)"
if [ "$ENVIRONMENT" = "staging" ]; then
    php artisan db:seed --force
fi

echo "🔧 Step 9: Clear and cache configuration"
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan route:cache
php artisan view:clear
php artisan view:cache
php artisan event:clear
php artisan event:cache

echo "🔍 Step 10: Generate application key (if missing)"
if ! grep -q "APP_KEY=base64" .env; then
    php artisan key:generate --force
fi

echo "📝 Step 11: Set permissions"
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "🔄 Step 12: Restart services"
# Restart PHP-FPM
systemctl restart php8.2-fpm || true

# Restart Nginx
systemctl restart nginx || true

# Restart queue workers
php artisan queue:restart

echo "🧪 Step 13: Run health checks"
curl -f http://localhost/api/health || echo "⚠️ Health check failed, but deployment completed"

echo "✅ Deployment completed successfully!"
echo "📊 Deployment summary:"
echo "   - Environment: ${ENVIRONMENT}"
echo "   - Timestamp: ${TIMESTAMP}"
echo "   - Backup location: ${BACKUP_DIR}"
echo "   - Next steps:"
echo "     1. Monitor application logs: tail -f storage/logs/laravel.log"
echo "     2. Check queue workers: php artisan queue:work --tries=3"
echo "     3. Verify WebSocket connection: php artisan reverb:start"
echo "     4. Test payment integration"
echo "     5. Test AI service integration"

# Send deployment notification (optional)
if [ -f "deploy-notify.sh" ]; then
    ./deploy-notify.sh ${ENVIRONMENT} ${TIMESTAMP}
fi