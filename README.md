# API Backend Blog & E-commerce

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  Una API backend integral de NestJS para una plataforma de blog y e-commerce con arquitectura de base de datos dual (PostgreSQL + MongoDB).
</p>

<p align="center">
  <a href="https://ecommerce-blog-backend.onrender.com" target="_blank">🚀 API en Vivo</a> |
  <a href="#documentación-api">📚 Documentación API</a> |
  <a href="#modelos-de-base-de-datos">🗄️ Modelos de BD</a>
</p>

## 🏗️ Vista General de Arquitectura

Este proyecto sigue una **arquitectura monolítica modular** construida con NestJS, implementando una **estrategia de base de datos dual**:

- **PostgreSQL**: Maneja datos relacionales (Usuarios, Productos, Categorías, Pedidos, ElementosPedido)
- **MongoDB**: Gestiona datos basados en documentos (Reseñas, Logs, Analíticas)

### 🔧 Tecnologías Principales

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Framework** | NestJS 11.x | Framework progresivo de Node.js |
| **Lenguaje** | TypeScript | Desarrollo con seguridad de tipos |
| **BD Primaria** | PostgreSQL (Neon) | Datos relacionales y transacciones ACID |
| **BD Secundaria** | MongoDB Atlas | Almacenamiento de documentos y analíticas |
| **ORM** | TypeORM | Mapeo objeto-relacional para PostgreSQL |
| **ODM** | Mongoose | Mapeo objeto-documento para MongoDB |
| **Autenticación** | JWT + bcrypt | Autenticación segura basada en tokens |
| **Validación** | Class Validator | Validación y transformación de DTO |
| **Email** | Nodemailer | Emails transaccionales |
| **Despliegue** | Render | Plataforma de hosting en la nube |

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                   Puerto: 3000                              │
└─────────────────────┬───────────────────────────────────────┘
                      │ Peticiones HTTP/HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 API Backend NestJS                          │
│                   Puerto: 3030                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │Controladores│ │ Servicios   │ │   Guards y Filtros      ││
│  │             │ │             │ │                         ││
│  │ • Auth      │ │ • Lógica de │ │ • JWT Auth Guard        ││
│  │ • Products  │ │   Negocio   │ │ • Admin Guard           ││
│  │ • Users     │ │ • Acceso a  │ │ • Exception Filter      ││
│  │ • Orders    │ │   Datos     │ │ • Validation Pipe       ││
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

## 📁 Estructura del Proyecto

```
src/
├── 📂 auth/                    # Módulo de autenticación
│   ├── auth.controller.ts      # Endpoints de login, registro, perfil
│   ├── auth.service.ts         # Gestión de tokens JWT
│   ├── dto/                    # Objetos de transferencia de datos
│   └── interfaces/             # Interfaces de autenticación
├── 📂 entities/                # Entidades TypeORM (PostgreSQL)
│   ├── user.entity.ts          # Definición de tabla User
│   ├── product.entity.ts       # Definición de tabla Product
│   ├── category.entity.ts      # Definición de tabla Category
│   ├── order.entity.ts         # Definición de tabla Order
│   └── order-item.entity.ts    # Definición de tabla OrderItem
├── 📂 schemas/                 # Esquemas Mongoose (MongoDB)
│   ├── review.schema.ts        # Reseñas de productos
│   └── log.schema.ts           # Logs del sistema
├── 📂 common/                  # Utilidades compartidas
│   ├── decorators/             # Decoradores personalizados
│   ├── guards/                 # Guards de autenticación
│   ├── filters/                # Filtros de excepción
│   ├── pipes/                  # Pipes de validación
│   └── interceptors/           # Interceptores de respuesta
├── 📄 app.controller.ts        # Endpoints principales de la API
├── 📄 app.service.ts           # Lógica de negocio principal
├── 📄 database.service.ts      # Servicio de conexión a BD
├── 📄 seed-data.service.ts     # Servicio de sembrado de BD
└── 📄 main.ts                  # Bootstrap de la aplicación
```

## 🧩 Componentes Principales

### 1. **Controladores** (Capa API)
- **AuthController**: Maneja autenticación (login, registro, perfil)
- **AppController**: Operaciones CRUD principales para todas las entidades
- **Endpoints de Salud**: Estado de BD y verificaciones de conectividad

### 2. **Servicios** (Capa de Lógica de Negocio)
- **AuthService**: Generación y validación de tokens JWT
- **DatabaseService**: Gestión de conexiones multi-base de datos
- **SeedDataService**: Inicialización y sembrado de base de datos

### 3. **Guards y Middleware**
- **JwtAuthGuard**: Protege rutas autenticadas
- **AdminGuard**: Restringe operaciones solo para administradores
- **ValidationPipe**: Validación y transformación de DTO

### 4. **Capa de Base de Datos**
- **TypeORM**: Gestión de entidades PostgreSQL
- **Mongoose**: Operaciones de documentos MongoDB

## 🗄️ Modelos de Base de Datos

### Entidades PostgreSQL (Datos Relacionales)

#### **Entidad User**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hasheado con bcrypt

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

#### **Entidad Product**
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

#### **Entidad Category**
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

#### **Entidad Order**
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

#### **Entidad OrderItem**
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
  productSnapshot: any; // Detalles del producto al momento de la compra
}
```

### Esquemas MongoDB (Datos de Documentos)

#### **Esquema Review**
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

#### **Esquema Log**
```typescript
@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string; // 'info', 'warn', 'error', 'debug'

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  service: string; // Qué servicio generó el log

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

## 🚀 Configuración e Instalación del Proyecto

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Base de datos PostgreSQL** (se recomienda Neon)
- **Base de datos MongoDB** (se recomienda Atlas)

### Variables de Entorno
Crea un archivo `.env` en el directorio raíz:

```bash
# Configuración de Base de Datos
DATABASE_URL=postgresql://username:password@host:port/database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Configuración JWT
JWT_SECRET=tu-secreto-jwt-super-seguro
JWT_EXPIRES_IN=3600s

# Configuración de Email
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-app-email

# Configuración del Servidor
PORT=3030
DB_SYNC=false
DB_LOGGING=false
```

### Instalación y Configuración

```bash
# Instalar dependencias
$ npm install

# Configuración de base de datos (ejecutar en este orden)
$ npm run db:reset      # Resetear base de datos
$ npm run db:migrate    # Ejecutar migraciones
$ npm run db:seed       # Sembrar datos iniciales

# Desarrollo
$ npm run start:dev

# Producción
$ npm run build
$ npm run start:prod
```

## 📡 Documentación API

### URL Base
- **Producción**: `https://ecommerce-blog-backend.onrender.com`
- **Desarrollo**: `http://localhost:3030`

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `POST` | `/auth/register` | Crear nueva cuenta de usuario | ❌ |
| `POST` | `/auth/login` | Autenticar usuario | ❌ |
| `GET` | `/auth/profile` | Obtener perfil del usuario actual | ✅ |

### Gestión de Usuarios

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `GET` | `/users` | Listar todos los usuarios | ✅ Admin |
| `POST` | `/users` | Crear nuevo usuario | ✅ Admin |
| `GET` | `/users/:id` | Obtener usuario por ID | ✅ |
| `PUT` | `/users/:id` | Actualizar usuario | ✅ |
| `DELETE` | `/users/:id` | Eliminar usuario | ✅ Admin |

### Gestión de Productos

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `GET` | `/products` | Listar todos los productos | ❌ |
| `GET` | `/products/:id` | Obtener producto por ID | ❌ |
| `POST` | `/admin/products` | Crear nuevo producto | ✅ Admin |
| `PUT` | `/products/:id` | Actualizar producto | ✅ Admin |
| `DELETE` | `/admin/products/:id` | Eliminar producto | ✅ Admin |

### Gestión de Categorías

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `GET` | `/categories` | Listar todas las categorías | ❌ |
| `GET` | `/categories/:id` | Obtener categoría por ID | ❌ |
| `POST` | `/categories` | Crear nueva categoría | ✅ Admin |
| `PUT` | `/categories/:id` | Actualizar categoría | ✅ Admin |
| `DELETE` | `/categories/:id` | Eliminar categoría | ✅ Admin |

### Gestión de Pedidos

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `GET` | `/orders` | Listar todos los pedidos | ✅ Admin |
| `GET` | `/orders/:id` | Obtener pedido por ID | ✅ |
| `POST` | `/orders` | Crear nuevo pedido | ✅ |
| `PUT` | `/orders/:id` | Actualizar estado del pedido | ✅ Admin |
| `DELETE` | `/orders/:id` | Eliminar pedido | ✅ Admin |

### Sistema y Salud

| Método | Endpoint | Descripción | Autenticación Requerida |
|--------|----------|-------------|------------------------|
| `GET` | `/` | Verificación de salud de la API | ❌ |
| `GET` | `/health/db` | Estado de la base de datos | ❌ |
| `POST` | `/dev/seed-all-data` | Sembrar datos de desarrollo | ❌ |
| `POST` | `/admin/hard-reset-database` | Resetear base de datos | ✅ Admin |

### Ejemplos de Request/Response

#### Autenticación
```bash
# Registrar nuevo usuario
POST /auth/register
{
  "email": "usuario@example.com",
  "password": "contraseñaSegura123",
  "firstName": "Juan",
  "lastName": "Pérez"
}

# Respuesta
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "usuario@example.com", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Creación de Producto
```bash
# Crear producto (Solo Admin)
POST /admin/products
Authorization: Bearer <token>
{
  "name": "Laptop Gaming",
  "description": "Laptop de alto rendimiento para gaming",
  "price": "1299.99",
  "stock": 50,
  "categoryId": 1,
  "images": ["https://example.com/imagen1.jpg"]
}
```

## 🧪 Pruebas

```bash
# Pruebas unitarias
$ npm run test

# Pruebas E2E
$ npm run test:e2e

# Cobertura de pruebas
$ npm run test:cov

# Modo observación
$ npm run test:watch
```

### Configuración de Base de Datos de Pruebas
```bash
# Crear base de datos de pruebas
$ npm run test:db:setup

# Ejecutar pruebas con base de datos de pruebas
$ npm run test:db
```

## 🚀 Despliegue

### Despliegue en Render (Actual)

Esta aplicación está desplegada en [Render](https://render.com) con la siguiente configuración:

**API en Vivo**: `https://ecommerce-blog-backend.onrender.com`

#### Variables de Entorno (Panel de Render)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=tu-secreto-jwt
JWT_EXPIRES_IN=3600s
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-email
PORT=3030
DB_SYNC=false
DB_LOGGING=false
```

#### Pasos de Despliegue
1. Conectar tu repositorio de GitHub a Render
2. Configurar variables de entorno en el panel de Render
3. Establecer comando de construcción: `npm install && npm run build`
4. Establecer comando de inicio: `npm run start:prod`
5. Desplegar automáticamente en git push

### Opciones Alternativas de Despliegue

#### Despliegue con Docker
```bash
# Construir imagen Docker
$ docker build -t blog-ecommerce-api .

# Ejecutar con variables de entorno
$ docker run -p 3030:3030 --env-file .env blog-ecommerce-api
```

#### Despliegue Manual en VPS
```bash
# Clonar repositorio
$ git clone <url-del-repositorio>
$ cd backend-blog-ecommerce

# Instalar dependencias
$ npm install

# Construir aplicación
$ npm run build

# Iniciar con PM2
$ npm install -g pm2
$ pm2 start dist/main.js --name "blog-ecommerce-api"
```

## 🔒 Características de Seguridad

### Autenticación y Autorización
- **Tokens JWT**: Autenticación sin estado segura
- **Encriptación bcrypt**: Cifrado de contraseñas con salt rounds
- **Acceso basado en Roles**: Separación de roles admin y cliente
- **Guardias de Rutas**: Endpoints protegidos con verificación de autenticación

### Validación de Datos
- **Class Validator**: Validación DTO para todas las entradas
- **TypeScript**: Verificación de tipos en tiempo de compilación
- **Sanitización**: Sanitización de entradas para prevenir XSS

### Seguridad de Base de Datos
- **Consultas Parametrizadas**: Prevención de inyección SQL
- **Cifrado de Conexión**: SSL/TLS para conexiones de base de datos
- **Variables de Entorno**: Protección de datos sensibles

## 📊 Rendimiento y Escalabilidad

### Optimización de Base de Datos
- **Columnas Indexadas**: Claves primarias, foráneas y campos de búsqueda
- **Pool de Conexiones**: Gestión eficiente de conexiones de base de datos
- **Optimización de Consultas**: Consultas eficientes con TypeORM y Mongoose

### Estrategia de Caché
- **Caché de Respuestas**: Caché de respuestas API para datos estáticos
- **Caché de Consultas de BD**: Caché de resultados de consultas TypeORM
- **Caché de Assets Estáticos**: Caché de imágenes y archivos

### Monitoreo y Registro
- **Registro Estructurado**: Almacenamiento de logs basado en MongoDB
- **Seguimiento de Errores**: Registro y monitoreo integral de errores
- **Verificaciones de Salud**: Endpoints de salud de base de datos y servicios

## 🛠️ Herramientas de Desarrollo

### Calidad de Código
- **ESLint**: Linting y aplicación de estilo de código
- **Prettier**: Formateo de código
- **TypeScript**: Verificación de tipos estáticos
- **Husky**: Hooks de Git para calidad de código

### Herramientas de Base de Datos
- **CLI de TypeORM**: Migración de base de datos y gestión de esquemas
- **MongoDB Compass**: Visualización y consulta de base de datos
- **pgAdmin**: Administración de base de datos PostgreSQL

### Desarrollo de API
- **Colecciones Postman**: Pruebas de API preconfiguradas
- **Swagger/OpenAPI**: Documentación de API (próximamente)
- **Thunder Client**: Extensión de VS Code para pruebas de API

## 📈 Mejoras Futuras

### Características Planificadas
- [ ] **API GraphQL**: Alternativa a endpoints REST
- [ ] **Caché Redis**: Capa de caché avanzada
- [ ] **Subida de Archivos**: Funcionalidad de subida de imágenes y documentos
- [ ] **Características en Tiempo Real**: Implementación WebSocket
- [ ] **Limitación de Tasa de API**: Throttling y protección de solicitudes
- [ ] **Pruebas Integrales**: Cobertura de pruebas unitarias e de integración
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

- [ ] **Documentación Swagger**: Documentación interactiva de API
- [ ] **Notificaciones Email**: Sistema de notificaciones por correo
- [ ] **Análisis y Reportes**: Dashboard de métricas y análisis

### Estándares de Código
- Seguir las mejores prácticas de TypeScript
- Usar nombres significativos para variables y funciones
- Escribir comentarios JSDoc comprehensivos
- Mantener cobertura de pruebas por encima del 80%
- Seguir el estilo y patrones de código existentes

## 📋 Solución de Problemas

### Problemas Comunes

#### Problemas de Conexión a Base de Datos
```bash
# Verificar conectividad de base de datos
$ npm run health:db

# Resetear base de datos
$ npm run db:reset

# Recrear esquema
$ npm run db:migrate
```

#### Problemas de Autenticación
```bash
# Verificar configuración de secreto JWT
# Revisar configuración de expiración de tokens
# Asegurar formato correcto de header: "Bearer <token>"
```

#### Problemas de Despliegue
```bash
# Verificar variables de entorno
# Verificar URLs de base de datos
# Revisar logs de construcción en el panel de Render
```

## 📞 Soporte y Contacto

### Recursos
- **Documentación**: [Documentación de API](#documentación-api)
- **Guía de Base de Datos**: [Modelos de Base de Datos](#modelos-de-base-de-datos)
- **Guía de Despliegue**: [RENDER_ENV_GUIDE.md](./RENDER_ENV_GUIDE.md)
- **Colección Postman**: [Guía de Importación](./POSTMAN_IMPORT_GUIDE.md)

### Obtener Ayuda
- Crear un issue para bugs o solicitudes de características
- Revisar documentación y guías existentes
- Consultar la sección de solución de problemas arriba

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Construido con ❤️ usando <a href="https://nestjs.com">NestJS</a> • 
  <a href="https://www.postgresql.org">PostgreSQL</a> • 
  <a href="https://www.mongodb.com">MongoDB</a>
</p>
