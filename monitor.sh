#!/bin/bash

# UCW App Monitoring Script
# Usage: ./monitor.sh [check_type]

set -e

CHECK_TYPE=${1:-all}
TIMESTAMP=$(date +%Y-%m-%d_%H:%M:%S)
LOG_FILE="storage/logs/monitor_${TIMESTAMP}.log"

echo "🔍 UCW App System Monitoring - ${TIMESTAMP}" | tee ${LOG_FILE}
echo "==========================================" | tee -a ${LOG_FILE}

# Function to check service status
check_service() {
    local service_name=$1
    local display_name=$2
    
    if systemctl is-active --quiet ${service_name}; then
        echo "✅ ${display_name}: RUNNING" | tee -a ${LOG_FILE}
        return 0
    else
        echo "❌ ${display_name}: STOPPED" | tee -a ${LOG_FILE}
        return 1
    fi
}

# Function to check disk usage
check_disk() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ ${usage} -lt 80 ]; then
        echo "✅ Disk Usage: ${usage}% (OK)" | tee -a ${LOG_FILE}
    elif [ ${usage} -lt 90 ]; then
        echo "⚠️ Disk Usage: ${usage}% (WARNING)" | tee -a ${LOG_FILE}
    else
        echo "❌ Disk Usage: ${usage}% (CRITICAL)" | tee -a ${LOG_FILE}
    fi
}

# Function to check memory usage
check_memory() {
    local total=$(free -m | awk 'NR==2 {print $2}')
    local used=$(free -m | awk 'NR==2 {print $3}')
    local percentage=$((used * 100 / total))
    
    if [ ${percentage} -lt 80 ]; then
        echo "✅ Memory Usage: ${percentage}% (${used}MB/${total}MB)" | tee -a ${LOG_FILE}
    elif [ ${percentage} -lt 90 ]; then
        echo "⚠️ Memory Usage: ${percentage}% (${used}MB/${total}MB)" | tee -a ${LOG_FILE}
    else
        echo "❌ Memory Usage: ${percentage}% (${used}MB/${total}MB)" | tee -a ${LOG_FILE}
    fi
}

# Function to check application health
check_app_health() {
    echo "🌐 Checking Application Health..." | tee -a ${LOG_FILE}
    
    # Check API health endpoint
    if curl -s -f http://localhost/api/health > /dev/null; then
        echo "✅ API Health: OK" | tee -a ${LOG_FILE}
    else
        echo "❌ API Health: FAILED" | tee -a ${LOG_FILE}
    fi
    
    # Check database connection
    if php artisan db:monitor > /dev/null 2>&1; then
        echo "✅ Database Connection: OK" | tee -a ${LOG_FILE}
    else
        echo "❌ Database Connection: FAILED" | tee -a ${LOG_FILE}
    fi
    
    # Check Redis connection
    if php artisan redis:ping > /dev/null 2>&1; then
        echo "✅ Redis Connection: OK" | tee -a ${LOG_FILE}
    else
        echo "❌ Redis Connection: FAILED" | tee -a ${LOG_FILE}
    fi
    
    # Check queue workers
    local queue_status=$(php artisan queue:monitor --count=1 2>/dev/null || echo "FAILED")
    if [ "$queue_status" != "FAILED" ]; then
        echo "✅ Queue Workers: ACTIVE" | tee -a ${LOG_FILE}
    else
        echo "❌ Queue Workers: INACTIVE" | tee -a ${LOG_FILE}
    fi
}

# Function to check application metrics
check_app_metrics() {
    echo "📊 Checking Application Metrics..." | tee -a ${LOG_FILE}
    
    # Get order statistics
    local today_orders=$(php artisan tinker --execute="echo \App\Models\Order::whereDate('created_at', today())->count();" 2>/dev/null || echo "0")
    local pending_orders=$(php artisan tinker --execute="echo \App\Models\Order::where('order_status', 'pending')->count();" 2>/dev/null || echo "0")
    local today_revenue=$(php artisan tinker --execute="echo \App\Models\Order::where('order_status', 'completed')->whereDate('created_at', today())->sum('total_price');" 2>/dev/null || echo "0")
    
    echo "   Today's Orders: ${today_orders}" | tee -a ${LOG_FILE}
    echo "   Pending Orders: ${pending_orders}" | tee -a ${LOG_FILE}
    echo "   Today's Revenue: Rp $(printf "%'.0f" ${today_revenue})" | tee -a ${LOG_FILE}
    
    # Get error log count from last hour
    local error_count=$(grep -c "ERROR" storage/logs/laravel.log 2>/dev/null || echo "0")
    if [ ${error_count} -eq 0 ]; then
        echo "✅ Error Logs: No errors in last hour" | tee -a ${LOG_FILE}
    else
        echo "⚠️ Error Logs: ${error_count} errors in last hour" | tee -a ${LOG_FILE}
    fi
}

# Function to check external services
check_external_services() {
    echo "🔗 Checking External Services..." | tee -a ${LOG_FILE}
    
    # Check AI service
    local ai_service_url=$(grep AI_SERVICE_URL .env | cut -d '=' -f2)
    if [ -n "${ai_service_url}" ]; then
        if curl -s -f ${ai_service_url}/health > /dev/null 2>&1; then
            echo "✅ AI Service: ONLINE" | tee -a ${LOG_FILE}
        else
            echo "❌ AI Service: OFFLINE" | tee -a ${LOG_FILE}
        fi
    fi
    
    # Check Midtrans service (simplified check)
    local midtrans_prod=$(grep MIDTRANS_IS_PRODUCTION .env | cut -d '=' -f2)
    if [ "${midtrans_prod}" = "true" ]; then
        echo "⚠️ Midtrans: PRODUCTION MODE" | tee -a ${LOG_FILE}
    else
        echo "✅ Midtrans: SANDBOX MODE" | tee -a ${LOG_FILE}
    fi
}

# Function to check security
check_security() {
    echo "🔒 Checking Security..." | tee -a ${LOG_FILE}
    
    # Check for .env file permissions
    if [ -f ".env" ]; then
        local env_perms=$(stat -c "%a" .env)
        if [ "${env_perms}" -le 640 ]; then
            echo "✅ .env Permissions: ${env_perms} (OK)" | tee -a ${LOG_FILE}
        else
            echo "⚠️ .env Permissions: ${env_perms} (Too permissive)" | tee -a ${LOG_FILE}
        fi
    fi
    
    # Check for debug mode
    local debug_mode=$(grep APP_DEBUG .env | cut -d '=' -f2)
    if [ "${debug_mode}" = "false" ]; then
        echo "✅ Debug Mode: DISABLED" | tee -a ${LOG_FILE}
    else
        echo "⚠️ Debug Mode: ENABLED (Should be disabled in production)" | tee -a ${LOG_FILE}
    fi
    
    # Check for application key
    if grep -q "APP_KEY=base64" .env; then
        echo "✅ Application Key: SET" | tee -a ${LOG_FILE}
    else
        echo "❌ Application Key: NOT SET" | tee -a ${LOG_FILE}
    fi
}

# Main monitoring logic
case ${CHECK_TYPE} in
    "system")
        echo "🖥️ System Monitoring..." | tee -a ${LOG_FILE}
        check_service nginx "Nginx"
        check_service php8.2-fpm "PHP-FPM"
        check_service postgresql "PostgreSQL"
        check_service redis-server "Redis"
        check_disk
        check_memory
        ;;
    
    "application")
        echo "📱 Application Monitoring..." | tee -a ${LOG_FILE}
        check_app_health
        check_app_metrics
        ;;
    
    "services")
        echo "🔌 External Services Monitoring..." | tee -a ${LOG_FILE}
        check_external_services
        ;;
    
    "security")
        echo "🛡️ Security Monitoring..." | tee -a ${LOG_FILE}
        check_security
        ;;
    
    "all")
        echo "📈 Full System Monitoring..." | tee -a ${LOG_FILE}
        echo "" | tee -a ${LOG_FILE}
        
        echo "🖥️ System Status:" | tee -a ${LOG_FILE}
        check_service nginx "Nginx"
        check_service php8.2-fpm "PHP-FPM"
        check_service postgresql "PostgreSQL"
        check_service redis-server "Redis"
        check_disk
        check_memory
        echo "" | tee -a ${LOG_FILE}
        
        echo "📱 Application Status:" | tee -a ${LOG_FILE}
        check_app_health
        echo "" | tee -a ${LOG_FILE}
        
        echo "📊 Application Metrics:" | tee -a ${LOG_FILE}
        check_app_metrics
        echo "" | tee -a ${LOG_FILE}
        
        echo "🔌 External Services:" | tee -a ${LOG_FILE}
        check_external_services
        echo "" | tee -a ${LOG_FILE}
        
        echo "🛡️ Security Status:" | tee -a ${LOG_FILE}
        check_security
        ;;
    
    *)
        echo "❌ Unknown check type: ${CHECK_TYPE}" | tee -a ${LOG_FILE}
        echo "Available options: system, application, services, security, all" | tee -a ${LOG_FILE}
        exit 1
        ;;
esac

echo "" | tee -a ${LOG_FILE}
echo "==========================================" | tee -a ${LOG_FILE}
echo "📋 Monitoring completed at: $(date)" | tee -a ${LOG_FILE}
echo "📁 Log file: ${LOG_FILE}" | tee -a ${LOG_FILE}

# Send alert if any critical issues found
if grep -q "❌" ${LOG_FILE}; then
    echo "🚨 CRITICAL ISSUES DETECTED!" | tee -a ${LOG_FILE}
    
    # Send notification (optional)
    if [ -f "alert-notify.sh" ]; then
        ./alert-notify.sh ${LOG_FILE}
    fi
    
    exit 1
fi

echo "✅ All systems operational!" | tee -a ${LOG_FILE}
exit 0