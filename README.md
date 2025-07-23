# Blog & E-commerce Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A comprehensive NestJS backend API for a blog and e-commerce platform with dual database architecture (PostgreSQL + MongoDB).
</p>

<p align="center">
  <a href="https://ecommerce-blog-backend.onrender.com" target="_blank">🚀 Live API</a> |
  <a href="#api-documentation">📚 API Docs</a> |
  <a href="#database-models">🗄️ Database Models</a>
</p>

## 🏗️ Architecture Overview

This project follows a **modular monolithic architecture** built with NestJS, implementing a **dual database strategy**:

- **PostgreSQL**: Handles relational data (Users, Products, Categories, Orders, OrderItems)
- **MongoDB**: Manages document-based data (Reviews, Logs, Analytics)

### 🔧 Core Technologies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | NestJS 11.x | Progressive Node.js framework |
| **Language** | TypeScript | Type-safe development |
| **Primary DB** | PostgreSQL (Neon) | Relational data & ACID transactions |
| **Secondary DB** | MongoDB Atlas | Document storage & analytics |
| **ORM** | TypeORM | PostgreSQL object-relational mapping |
| **ODM** | Mongoose | MongoDB object document mapping |
| **Authentication** | JWT + bcrypt | Secure token-based auth |
| **Validation** | Class Validator | DTO validation & transformation |
| **Email** | Nodemailer | Transactional emails |
| **Deployment** | Render | Cloud hosting platform |

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                   Port: 3000                                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS Requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 NestJS Backend API                          │
│                   Port: 3030                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ Controllers │ │ Services    │ │    Guards & Filters     ││
│  │             │ │             │ │                         ││
│  │ • Auth      │ │ • Business  │ │ • JWT Auth Guard        ││
│  │ • Products  │ │   Logic     │ │ • Admin Guard           ││
│  │ • Users     │ │ • Data      │ │ • Exception Filter      ││
│  │ • Orders    │ │   Access    │ │ • Validation Pipe       ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────┬───────────────┬───────────────────────────────┘
              │               │
              ▼               ▼
    ┌─────────────────┐   ┌─────────────────┐
    │   PostgreSQL    │   │    MongoDB      │
    │   (Neon Cloud)  │   │   (Atlas)       │
    │                 │   │                 │
    │ • Users         │   │ • Reviews       │
    │ • Products      │   │ • Logs          │
    │ • Categories    │   │ • Analytics     │
    │ • Orders        │   │                 │
    │ • OrderItems    │   │                 │
    └─────────────────┘   └─────────────────┘
```

## 📁 Project Structure

```
src/
├── 📂 auth/                    # Authentication module
│   ├── auth.controller.ts      # Login, register, profile endpoints
│   ├── auth.service.ts         # JWT token management
│   ├── dto/                    # Data transfer objects
│   └── interfaces/             # Auth interfaces
├── 📂 entities/                # TypeORM entities (PostgreSQL)
│   ├── user.entity.ts          # User table definition
│   ├── product.entity.ts       # Product table definition
│   ├── category.entity.ts      # Category table definition
│   ├── order.entity.ts         # Order table definition
│   └── order-item.entity.ts    # OrderItem table definition
├── 📂 schemas/                 # Mongoose schemas (MongoDB)
│   ├── review.schema.ts        # Product reviews
│   └── log.schema.ts           # System logs
├── 📂 common/                  # Shared utilities
│   ├── decorators/             # Custom decorators
│   ├── guards/                 # Authentication guards
│   ├── filters/                # Exception filters
│   ├── pipes/                  # Validation pipes
│   └── interceptors/           # Response interceptors
├── 📄 app.controller.ts        # Main API endpoints
├── 📄 app.service.ts           # Core business logic
├── 📄 database.service.ts      # Database connection service
├── 📄 seed-data.service.ts     # Database seeding service
└── 📄 main.ts                  # Application bootstrap
```

## 🧩 Core Components

### 1. **Controllers** (API Layer)
- **AuthController**: Handles authentication (login, register, profile)
- **AppController**: Main CRUD operations for all entities
- **Health Endpoints**: Database status and connectivity checks

### 2. **Services** (Business Logic Layer)
- **AuthService**: JWT token generation and validation
- **DatabaseService**: Multi-database connection management
- **SeedDataService**: Database initialization and seeding

### 3. **Guards & Middleware**
- **JwtAuthGuard**: Protects authenticated routes
- **AdminGuard**: Restricts admin-only operations
- **ValidationPipe**: DTO validation and transformation

### 4. **Database Layer**
- **TypeORM**: PostgreSQL entity management
- **Mongoose**: MongoDB document operations

## 🗄️ Database Models

### PostgreSQL Entities (Relational Data)

#### **User Entity**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hashed

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole; // 'admin' | 'customer'

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### **Product Entity**
```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column()
  categoryId: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### **Category Entity**
```typescript
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column('json', { nullable: true })
  metadata: any;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### **Order Entity**
```typescript
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus; // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus; // 'pending' | 'completed' | 'failed' | 'refunded'

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: string;

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: string;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingAmount: string;

  @Column('decimal', { precision: 10, scale: 2 })
  discountAmount: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column('json', { nullable: true })
  shippingAddress: any;

  @Column('json', { nullable: true })
  billingAddress: any;

  @Column()
  paymentMethod: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### **OrderItem Entity**
```typescript
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderItems)
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: string;

  @Column('json', { nullable: true })
  productSnapshot: any; // Product details at time of purchase
}
```

### MongoDB Schemas (Document Data)

#### **Review Schema**
```typescript
@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  productId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
```

#### **Log Schema**
```typescript
@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string; // 'info', 'warn', 'error', 'debug'

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  service: string; // Which service generated the log

  @Prop()
  userId?: number;

  @Prop()
  action?: string; // 'create', 'update', 'delete', 'login', etc.

  @Prop()
  resourceId?: string;

  @Prop()
  resourceType?: string; // 'user', 'product', 'order', etc.

  @Prop({ type: Object })
  metadata?: any;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}
```

## 🚀 Project Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (Neon recommended)
- **MongoDB** database (Atlas recommended)

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=3600s

# Email Configuration
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-email-app-password

# Server Configuration
PORT=3030
DB_SYNC=false
DB_LOGGING=false
```

### Installation & Setup

```bash
# Install dependencies
$ npm install

# Database setup (run these in order)
$ npm run db:reset      # Reset database
$ npm run db:migrate    # Run migrations
$ npm run db:seed       # Seed initial data

# Development
$ npm run start:dev

# Production
$ npm run build
$ npm run start:prod
```

## 📡 API Documentation

### Base URL
- **Production**: `https://ecommerce-blog-backend.onrender.com`
- **Development**: `http://localhost:3030`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Create new user account | ❌ |
| `POST` | `/auth/login` | Authenticate user | ❌ |
| `GET` | `/auth/profile` | Get current user profile | ✅ |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | List all users | ✅ Admin |
| `POST` | `/users` | Create new user | ✅ Admin |
| `GET` | `/users/:id` | Get user by ID | ✅ |
| `PUT` | `/users/:id` | Update user | ✅ |
| `DELETE` | `/users/:id` | Delete user | ✅ Admin |

### Product Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/products` | List all products | ❌ |
| `GET` | `/products/:id` | Get product by ID | ❌ |
| `POST` | `/admin/products` | Create new product | ✅ Admin |
| `PUT` | `/products/:id` | Update product | ✅ Admin |
| `DELETE` | `/admin/products/:id` | Delete product | ✅ Admin |

### Category Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/categories` | List all categories | ❌ |
| `GET` | `/categories/:id` | Get category by ID | ❌ |
| `POST` | `/categories` | Create new category | ✅ Admin |
| `PUT` | `/categories/:id` | Update category | ✅ Admin |
| `DELETE` | `/categories/:id` | Delete category | ✅ Admin |

### Order Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/orders` | List all orders | ✅ Admin |
| `GET` | `/orders/:id` | Get order by ID | ✅ |
| `POST` | `/orders` | Create new order | ✅ |
| `PUT` | `/orders/:id` | Update order status | ✅ Admin |
| `DELETE` | `/orders/:id` | Delete order | ✅ Admin |

### System & Health

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | API health check | ❌ |
| `GET` | `/health/db` | Database status | ❌ |
| `POST` | `/dev/seed-all-data` | Seed development data | ❌ |
| `POST` | `/admin/hard-reset-database` | Reset database | ✅ Admin |

### Request/Response Examples

#### Authentication
```bash
# Register new user
POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

# Response
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@example.com", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Product Creation
```bash
# Create product (Admin only)
POST /admin/products
Authorization: Bearer <token>
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": "1299.99",
  "stock": 50,
  "categoryId": 1,
  "images": ["https://example.com/image1.jpg"]
}
```

## 🧪 Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Watch mode
$ npm run test:watch
```

### Test Database Setup
```bash
# Create test database
$ npm run test:db:setup

# Run tests with test database
$ npm run test:db
```

## 🚀 Deployment

### Render Deployment (Current)

This application is deployed on [Render](https://render.com) with the following configuration:

**Live API**: `https://ecommerce-blog-backend.onrender.com`

#### Environment Variables (Render Dashboard)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=3600s
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-email-password
PORT=3030
DB_SYNC=false
DB_LOGGING=false
```

#### Deployment Steps
1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start:prod`
5. Deploy automatically on git push

### Alternative Deployment Options

#### Docker Deployment
```bash
# Build Docker image
$ docker build -t blog-ecommerce-api .

# Run with environment variables
$ docker run -p 3030:3030 --env-file .env blog-ecommerce-api
```

#### Manual VPS Deployment
```bash
# Clone repository
$ git clone <repository-url>
$ cd backend-blog-ecommerce

# Install dependencies
$ npm install

# Build application
$ npm run build

# Start with PM2
$ npm install -g pm2
$ pm2 start dist/main.js --name "blog-ecommerce-api"
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **bcrypt Hashing**: Password encryption with salt rounds
- **Role-based Access**: Admin and customer role separation
- **Route Guards**: Protected endpoints with authentication checks

### Data Validation
- **Class Validator**: DTO validation for all inputs
- **TypeScript**: Compile-time type checking
- **Sanitization**: Input sanitization to prevent XSS

### Database Security
- **Parameterized Queries**: SQL injection prevention
- **Connection Encryption**: SSL/TLS for database connections
- **Environment Variables**: Sensitive data protection

## 📊 Performance & Scalability

### Database Optimization
- **Indexed Columns**: Primary keys, foreign keys, and search fields
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Efficient TypeORM and Mongoose queries

### Caching Strategy
- **Response Caching**: API response caching for static data
- **Database Query Caching**: TypeORM query result caching
- **Static Asset Caching**: Image and file caching

### Monitoring & Logging
- **Structured Logging**: MongoDB-based log storage
- **Error Tracking**: Comprehensive error logging and monitoring
- **Health Checks**: Database and service health endpoints

## 🛠️ Development Tools

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for code quality

### Database Tools
- **TypeORM CLI**: Database migration and schema management
- **MongoDB Compass**: Database visualization and querying
- **pgAdmin**: PostgreSQL database administration

### API Development
- **Postman Collections**: Pre-configured API testing
- **Swagger/OpenAPI**: API documentation (coming soon)
- **Thunder Client**: VS Code API testing extension

## 📈 Future Enhancements

### Planned Features
- [ ] **GraphQL API**: Alternative to REST endpoints
- [ ] **Redis Caching**: Advanced caching layer
- [ ] **File Upload**: Image and document upload functionality
- [ ] **Real-time Features**: WebSocket implementation
- [ ] **API Rate Limiting**: Request throttling and protection
- [ ] **Comprehensive Testing**: Unit and integration test coverage
- [ ] **API Documentation**: Swagger/OpenAPI integration
- [ ] **Monitoring Dashboard**: Application performance monitoring

### Performance Improvements
- [ ] **Database Sharding**: Horizontal scaling for large datasets
- [ ] **CDN Integration**: Global content delivery
- [ ] **Microservices Migration**: Service-oriented architecture
- [ ] **Event-Driven Architecture**: Asynchronous processing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comprehensive JSDoc comments
- Maintain test coverage above 80%
- Follow the existing code style and patterns

## 📋 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
$ npm run health:db

# Reset database
$ npm run db:reset

# Recreate schema
$ npm run db:migrate
```

#### Authentication Problems
```bash
# Verify JWT secret configuration
# Check token expiration settings
# Ensure proper header format: "Bearer <token>"
```

#### Deployment Issues
```bash
# Check environment variables
# Verify database URLs
# Check build logs in Render dashboard
```

## 📞 Support & Contact

### Resources
- **Documentation**: [API Documentation](#api-documentation)
- **Database Guide**: [Database Models](#database-models)
- **Deployment Guide**: [RENDER_ENV_GUIDE.md](./RENDER_ENV_GUIDE.md)
- **Postman Collection**: [Import Guide](./POSTMAN_IMPORT_GUIDE.md)

### Getting Help
- Create an issue for bugs or feature requests
- Check existing documentation and guides
- Review the troubleshooting section above

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com">NestJS</a> • 
  <a href="https://www.postgresql.org">PostgreSQL</a> • 
  <a href="https://www.mongodb.com">MongoDB</a>
</p>
