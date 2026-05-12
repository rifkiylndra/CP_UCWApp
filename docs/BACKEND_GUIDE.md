# Backend Developer Guide - UCW App

## 📋 Overview

This guide provides comprehensive documentation for backend developers working on the Unand Co-Workspace Coffee Shop Management System.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Laravel 11
- **Database**: PostgreSQL
- **Realtime**: Laravel Reverb
- **Queue**: Database Queue
- **API**: RESTful API with Sanctum authentication
- **Frontend Integration**: Inertia.js v2

### Project Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Customer/     # Customer-facing controllers (QR ordering)
│   │   ├── Staff/        # Staff dashboard controllers
│   │   ├── Admin/        # Admin dashboard controllers
│   │   └── Controller.php
│   ├── Middleware/       # Custom middleware (RoleMiddleware)
│   ├── Requests/         # Form Request validation
│   └── Resources/        # API Resources
├── Models/               # Eloquent models
├── Services/             # Business logic services
├── Events/               # Laravel Events
├── Listeners/            # Event Listeners
├── Jobs/                 # Queueable Jobs
└── Providers/            # Service Providers
```

## 🔧 Development Setup

### Prerequisites
- PHP 8.2+
- Composer
- PostgreSQL 14+
- Node.js 18+ (for frontend)
- Redis (optional, for caching)

### Installation
```bash
# 1. Clone repository
git clone <repository-url>
cd CP_UCWApp

# 2. Install PHP dependencies
composer install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Configure database in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ucw_app
DB_USERNAME=postgres
DB_PASSWORD=your_password

# 5. Run migrations and seeders
php artisan migrate --seed

# 6. Install frontend dependencies
npm install

# 7. Build frontend assets
npm run build

# 8. Start development server
php artisan serve
php artisan reverb:start
npm run dev
```

## 📊 Database Schema

### Core Tables
1. **users** - Admin and staff accounts
2. **categories** - Menu categories
3. **menus** - Menu items
4. **tables** - Restaurant tables with QR codes
5. **orders** - Customer orders
6. **order_details** - Order items
7. **payments** - Payment transactions
8. **reviews** - Customer reviews
9. **system_configs** - System configuration

### Relationships
- Category has many Menus
- Menu belongs to Category
- Table has many Orders
- Order belongs to Table
- Order has many OrderDetails
- OrderDetail belongs to Order and Menu
- Order has many Payments
- Payment belongs to Order
- Order has one Review
- Review belongs to Order

## 🚀 API Endpoints

### Public Endpoints (No Authentication)
```
GET    /api/health                    # Health check
GET    /api/menu                      # Get all menus
GET    /api/menu/category/{id}        # Get menus by category
GET    /api/menu/search?q={query}     # Search menus
GET    /api/menu/{id}                 # Get menu details
POST   /api/order                     # Create order
GET    /api/order/{id}                # Get order details
GET    /api/order/table/{id}/orders   # Get table orders
POST   /api/payment/callback          # Midtrans callback
POST   /api/review/order/{id}         # Submit review
GET    /api/review/order/{id}         # Get order reviews
GET    /api/review/recent             # Get recent reviews
GET    /api/review/statistics         # Get review statistics
GET    /api/settings/system           # Get system settings
```

### Protected Endpoints (Require Authentication)

#### Staff Endpoints
```
GET    /api/staff/orders/status/{status}      # Get orders by status
PUT    /api/staff/order/{id}/status           # Update order status
GET    /api/staff/order/{id}                  # Get order details
GET    /api/staff/orders/today                # Get today's orders
GET    /api/staff/statistics                  # Get statistics
POST   /api/staff/order/{id}/verify-cash      # Verify cash payment
GET    /api/staff/payments/today              # Get today's payments
GET    /api/staff/payments/statistics         # Get payment statistics
```

#### Admin Endpoints
```
GET    /api/admin/statistics/orders-chart     # Get orders chart data
GET    /api/admin/statistics/revenue          # Get revenue statistics
GET    /api/admin/analytics/popular-menus     # Get popular menus (AI)
POST   /api/admin/analytics/analyze-sentiment # Analyze sentiment (AI)
GET    /api/admin/analytics/sentiment-summary # Get sentiment summary (AI)
GET    /api/admin/analytics/model-performance # Get AI model performance
GET    /api/admin/settings/all                # Get all settings
GET    /api/admin/settings/{key}              # Get specific setting
PUT    /api/admin/settings/{key}              # Update setting
PUT    /api/admin/settings                    # Update multiple settings
GET    /api/admin/settings/payment            # Get payment settings
PUT    /api/admin/settings/payment            # Update payment settings
```

## 🧠 Business Logic Services

### OrderService
Handles order creation, status updates, and order management.

**Key Methods:**
- `createOrder(array $orderData, array $orderItems): Order`
- `updateOrderStatus(int $orderId, string $status): Order`
- `getOrdersByStatus(string $status): Collection`
- `getOrderStatistics(): array`

### PaymentService
Handles payment processing and Midtrans integration.

**Key Methods:**
- `createSnapTransaction(Order $order, array $customerData): array`
- `handleNotification(array $notification): bool`
- `processCashPayment(Order $order, float $amountReceived): array`
- `verifyPayment(Payment $payment): array`

### AiService
Integrates with FastAPI AI microservice.

**Key Methods:**
- `getServingTimeEstimation(array $orderData): array`
- `getPopularMenus(int $limit = 10): array`
- `analyzeSentiment(string $reviewText): array`
- `getSentimentSummary(): array`

## 🔄 Events & Listeners

### Events
1. **NewOrderPlaced** - Triggered when new order is created
2. **OrderStatusUpdated** - Triggered when order status changes
3. **PaymentStatusUpdated** - Triggered when payment status changes

### Broadcasting Channels
- `staff-orders` - Public channel for staff order updates
- `staff-payments` - Public channel for staff payment updates
- `order.{orderId}` - Private channel for order-specific updates
- `admin-analytics` - Private channel for admin analytics

## 📝 Coding Standards

### Controller Guidelines
- Use dependency injection for services
- Keep controllers thin - delegate logic to services
- Use Form Request for validation
- Return appropriate HTTP status codes
- Use API Resources for JSON responses

### Service Guidelines
- One service per domain (OrderService, PaymentService, etc.)
- Handle business logic and external integrations
- Throw appropriate exceptions
- Log important operations

### Model Guidelines
- Define relationships clearly
- Use $fillable for mass assignment
- Add accessors/mutators when needed
- Use query scopes for common queries

### Validation Guidelines
- Use Form Request classes for complex validation
- Define custom validation messages in Indonesian
- Validate at the earliest point possible

## 🔒 Security

### Authentication
- Laravel Sanctum for API authentication
- Multi-role system (admin, staff)
- Session-based authentication for web routes

### Authorization
- Role-based access control (RBAC)
- Middleware for route protection
- Policy classes for complex authorization

### Data Protection
- Password hashing with bcrypt
- CSRF protection for web forms
- XSS protection
- SQL injection prevention via Eloquent

## 🧪 Testing

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter OrderServiceTest

# Run with coverage
php artisan test --coverage
```

### Test Structure
- **Unit Tests** - Test individual components
- **Feature Tests** - Test API endpoints
- **Integration Tests** - Test external services

## 📈 Performance Optimization

### Caching
- Use Laravel Cache for frequently accessed data
- Cache menu data, system settings
- Implement query caching for complex queries

### Database Optimization
- Add indexes to frequently queried columns
- Use eager loading to prevent N+1 queries
- Implement database partitioning for large tables

### Queue Processing
- Use queues for heavy operations (AI processing, email)
- Implement retry logic for failed jobs
- Monitor queue performance

## 🐛 Debugging

### Logging
- Use Laravel's logging system
- Log important business operations
- Log errors with context
- Monitor logs in production

### Error Handling
- Use try-catch blocks for external service calls
- Return meaningful error messages
- Implement custom exception handlers

## 🔄 Deployment

### Production Checklist
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Configure secure database credentials
- [ ] Set up SSL certificates
- [ ] Configure queue workers
- [ ] Set up monitoring and alerts
- [ ] Backup database regularly
- [ ] Test payment integration
- [ ] Test AI service integration

### Environment Variables
```env
# Required for production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=production-db-host
DB_PORT=5432
DB_DATABASE=ucw_app_prod
DB_USERNAME=secure_username
DB_PASSWORD=secure_password

# Redis (for caching and queue)
REDIS_HOST=redis-host
REDIS_PASSWORD=redis-password
REDIS_PORT=6379

# Midtrans (production)
MIDTRANS_SERVER_KEY=prod_server_key
MIDTRANS_CLIENT_KEY=prod_client_key
MIDTRANS_IS_PRODUCTION=true

# AI Service
AI_SERVICE_URL=https://ai-service-domain.com
AI_SERVICE_TIMEOUT=30

# Reverb (WebSocket)
REVERB_APP_ID=production-app-id
REVERB_APP_KEY=production-app-key
REVERB_APP_SECRET=production-app-secret
REVERB_HOST=your-domain.com
REVERB_PORT=443
REVERB_SCHEME=https
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Midtrans Documentation](https://docs.midtrans.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 🆘 Support

For backend-related issues:
1. Check the logs in `storage/logs/`
2. Review the database migrations
3. Verify environment configuration
4. Test API endpoints with Postman
5. Check queue worker status

For critical issues, contact the backend team lead.