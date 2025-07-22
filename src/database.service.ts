import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Role } from './common/enums/role.enum';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Log, LogDocument, LogLevel, LogCategory } from './schemas/log.schema';

@Injectable()
export class DatabaseService {
  constructor(
    // PostgreSQL User repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    // PostgreSQL Product repository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    // PostgreSQL Category repository
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    
    // PostgreSQL Order repository
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    // PostgreSQL OrderItem repository
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    
    // MongoDB Review model
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    
    // MongoDB Log model
    @InjectModel(Log.name)
    private readonly logModel: Model<LogDocument>,
  ) {}

  // PostgreSQL operations
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return await this.findUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // PostgreSQL Product operations
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, productData);
    return await this.findProductById(id);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // PostgreSQL Category operations
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    try {
      // Try with relations first
      return await this.categoryRepository.find({
        relations: ['products'],
        order: { sortOrder: 'ASC', name: 'ASC' }
      });
    } catch (relationError) {
      console.warn('Could not load categories with product relations, loading without relations:', relationError.message);
      // Fallback to basic query without relations
      return await this.categoryRepository.find({
        order: { sortOrder: 'ASC', name: 'ASC' }
      });
    }
  }

  async findAllCategoriesSimple(): Promise<Category[]> {
    // Simple query without any relations or complex ordering
    return await this.categoryRepository.find();
  }

  async findCategoryById(id: number): Promise<Category | null> {
    try {
      // Try with relations first
      return await this.categoryRepository.findOne({ 
        where: { id },
        relations: ['products']
      });
    } catch (relationError) {
      console.warn('Could not load category with product relations, loading without relations:', relationError.message);
      // Fallback to basic query without relations
      return await this.categoryRepository.findOne({ 
        where: { id }
      });
    }
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | null> {
    await this.categoryRepository.update(id, categoryData);
    return await this.findCategoryById(id);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // PostgreSQL Order operations
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    try {
      // Try with full relations first
      return await this.orderRepository.find({
        relations: ['user', 'orderItems', 'orderItems.product'],
        order: { createdAt: 'DESC' }
      });
    } catch (relationError) {
      console.warn('Could not load orders with full relations, trying basic relations:', relationError.message);
      try {
        // Try with just user relation
        return await this.orderRepository.find({
          relations: ['user'],
          order: { createdAt: 'DESC' }
        });
      } catch (basicError) {
        console.warn('Could not load orders with any relations, loading without relations:', basicError.message);
        // Fallback to no relations
        return await this.orderRepository.find({
          order: { createdAt: 'DESC' }
        });
      }
    }
  }

  async findOrderById(id: number): Promise<Order | null> {
    try {
      // Try with full relations first
      return await this.orderRepository.findOne({ 
        where: { id },
        relations: ['user', 'orderItems', 'orderItems.product']
      });
    } catch (relationError) {
      console.warn('Could not load order with full relations, trying basic relations:', relationError.message);
      try {
        // Try with just user relation
        return await this.orderRepository.findOne({ 
          where: { id },
          relations: ['user']
        });
      } catch (basicError) {
        console.warn('Could not load order with any relations, loading without relations:', basicError.message);
        // Fallback to no relations
        return await this.orderRepository.findOne({ 
          where: { id }
        });
      }
    }
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    try {
      // Try with full relations first
      return await this.orderRepository.find({
        where: { userId },
        relations: ['user', 'orderItems', 'orderItems.product'],
        order: { createdAt: 'DESC' }
      });
    } catch (relationError) {
      console.warn('Could not load user orders with full relations, trying basic relations:', relationError.message);
      try {
        // Try with just user relation
        return await this.orderRepository.find({
          where: { userId },
          relations: ['user'],
          order: { createdAt: 'DESC' }
        });
      } catch (basicError) {
        console.warn('Could not load user orders with any relations, loading without relations:', basicError.message);
        // Fallback to no relations
        return await this.orderRepository.find({
          where: { userId },
          order: { createdAt: 'DESC' }
        });
      }
    }
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | null> {
    await this.orderRepository.update(id, orderData);
    return await this.findOrderById(id);
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await this.orderRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // PostgreSQL OrderItem operations
  async createOrderItem(orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(orderItemData);
    return await this.orderItemRepository.save(orderItem);
  }

  async findAllOrderItems(): Promise<OrderItem[]> {
    try {
      // Try with relations first
      return await this.orderItemRepository.find({
        relations: ['product', 'order']
      });
    } catch (relationError) {
      console.warn('Could not load order items with relations, loading without relations:', relationError.message);
      // Fallback to no relations
      return await this.orderItemRepository.find();
    }
  }

  async findOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    try {
      // Try with relations first
      return await this.orderItemRepository.find({
        where: { orderId },
        relations: ['product']
      });
    } catch (relationError) {
      console.warn('Could not load order items with relations, loading without relations:', relationError.message);
      // Fallback to no relations
      return await this.orderItemRepository.find({
        where: { orderId }
      });
    }
  }

  async findOrderItemById(id: number): Promise<OrderItem | null> {
    try {
      // Try with relations first
      return await this.orderItemRepository.findOne({ 
        where: { id },
        relations: ['product', 'order']
      });
    } catch (relationError) {
      console.warn('Could not load order item with relations, loading without relations:', relationError.message);
      // Fallback to no relations
      return await this.orderItemRepository.findOne({ 
        where: { id }
      });
    }
  }

  async updateOrderItem(id: number, orderItemData: Partial<OrderItem>): Promise<OrderItem | null> {
    await this.orderItemRepository.update(id, orderItemData);
    return await this.findOrderItemById(id);
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    const result = await this.orderItemRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // MongoDB operations

  // Review operations (MongoDB)
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const review = new this.reviewModel(reviewData);
    return await review.save();
  }

  async findAllReviews(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async findReviewsByProduct(productId: string): Promise<Review[]> {
    return await this.reviewModel.find({ productId: parseInt(productId) }).exec();
  }

  async findReviewsByUser(userId: string): Promise<Review[]> {
    return await this.reviewModel.find({ userId }).exec();
  }

  async findReviewById(id: string): Promise<Review | null> {
    return await this.reviewModel.findById(id).exec();
  }

  async updateReviewHelpfulCount(id: string, increment: boolean = true): Promise<Review | null> {
    const updateValue = increment ? 1 : -1;
    return await this.reviewModel.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: updateValue } },
      { new: true }
    ).exec();
  }

  async updateReview(id: string, reviewData: Partial<Review>): Promise<Review | null> {
    return await this.reviewModel.findByIdAndUpdate(id, reviewData, { new: true }).exec();
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Log operations (MongoDB)
  async createLog(logData: Partial<Log>): Promise<Log> {
    const log = new this.logModel(logData);
    return await log.save();
  }

  async findAllLogs(limit: number = 100): Promise<Log[]> {
    return await this.logModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLogsByLevel(level: LogLevel, limit: number = 100): Promise<Log[]> {
    return await this.logModel.find({ level })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLogsByCategory(category: LogCategory, limit: number = 100): Promise<Log[]> {
    return await this.logModel.find({ category })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLogsByUser(userId: string, limit: number = 100): Promise<Log[]> {
    return await this.logModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100): Promise<Log[]> {
    return await this.logModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLogById(id: string): Promise<Log | null> {
    return await this.logModel.findById(id).exec();
  }

  async updateLog(id: string, logData: Partial<Log>): Promise<Log | null> {
    return await this.logModel.findByIdAndUpdate(id, logData, { new: true }).exec();
  }

  async deleteLog(id: string): Promise<boolean> {
    const result = await this.logModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Helper method to log API requests
  async logApiRequest(
    method: string,
    endpoint: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    requestData?: any,
    responseData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Log> {
    return await this.createLog({
      level: statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      category: LogCategory.API_REQUEST,
      message: `${method} ${endpoint} - ${statusCode}`,
      userId,
      endpoint,
      method,
      statusCode,
      responseTime,
      requestData,
      responseData,
      ipAddress,
      userAgent,
    });
  }

  // Helper method to log errors
  async logError(
    message: string,
    errorDetails?: any,
    userId?: string,
    category: LogCategory = LogCategory.ERROR
  ): Promise<Log> {
    return await this.createLog({
      level: LogLevel.ERROR,
      category,
      message,
      userId,
      errorDetails,
    });
  }

  // Database reset functionality - Updated for hosted PostgreSQL
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting database reset...');
      
      // Instead of using session_replication_role, manually handle dependencies
      // Use TRUNCATE or DELETE FROM to clear all data
      
      // 1. Clear all data using raw SQL to avoid TypeORM empty criteria restrictions
      await this.orderItemRepository.query('DELETE FROM "order_items"');
      console.log('Cleared order_items table');
      
      await this.orderRepository.query('DELETE FROM "orders"');
      console.log('Cleared orders table');
      
      await this.productRepository.query('DELETE FROM "app_products"');  // Changed to app_products
      console.log('Cleared app_products table');
      
      await this.categoryRepository.query('DELETE FROM "categories"');
      console.log('Cleared categories table');
      
      await this.userRepository.query('DELETE FROM "app_users"');
      console.log('Cleared users table');
      
      // 2. Clear MongoDB collections
      await this.reviewModel.deleteMany({});
      console.log('Cleared reviews collection');
      
      await this.logModel.deleteMany({});
      console.log('Cleared logs collection');
      
      // 3. Reset sequences to start from 1
      try {
        await this.userRepository.query('ALTER SEQUENCE "app_users_id_seq" RESTART WITH 1');
        await this.categoryRepository.query('ALTER SEQUENCE "categories_id_seq" RESTART WITH 1');
        await this.productRepository.query('ALTER SEQUENCE "app_products_id_seq" RESTART WITH 1');  // Changed sequence name
        await this.orderRepository.query('ALTER SEQUENCE "orders_id_seq" RESTART WITH 1');
        await this.orderItemRepository.query('ALTER SEQUENCE "order_items_id_seq" RESTART WITH 1');
        console.log('Reset all sequences successfully');
      } catch (seqError) {
        console.warn('Some sequences could not be reset (they may not exist yet):', seqError.message);
      }
      
      console.log('Database reset completed successfully');
      
      return {
        success: true,
        message: 'Database reset successfully. All data cleared and sequences reset. Tables preserved with correct schema.'
      };
    } catch (error) {
      console.error('Database reset failed:', error);
      return {
        success: false,
        message: `Database reset failed: ${error.message}`
      };
    }
  }

  // Hard reset functionality - Drops and recreates everything
  async hardResetDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting HARD database reset - This will drop all tables and collections!');
      
      // 1. Drop all PostgreSQL tables with CASCADE to handle dependencies
      const tablesToDrop = [
        'order_items',
        'orders', 
        'app_products',  // Changed from 'products' to 'app_products'
        'categories',
        'app_users',
        'discount_categories', // Legacy table
        'discounts', // Legacy table
        'migrations' // TypeORM migrations
      ];

      for (const table of tablesToDrop) {
        try {
          await this.userRepository.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
          console.log(`Dropped table: ${table}`);
        } catch (dropError) {
          console.warn(`Could not drop table ${table}:`, dropError.message);
        }
      }

      // 2. Drop all enum types
      const enumsToDrop = [
        'role_enum',
        'order_status_enum',
        'payment_status_enum'
      ];

      for (const enumType of enumsToDrop) {
        try {
          await this.userRepository.query(`DROP TYPE IF EXISTS "${enumType}" CASCADE`);
          console.log(`Dropped enum type: ${enumType}`);
        } catch (enumError) {
          console.warn(`Could not drop enum ${enumType}:`, enumError.message);
        }
      }

      // 3. Drop all sequences
      const sequencesToDrop = [
        'app_users_id_seq',
        'categories_id_seq', 
        'app_products_id_seq',  // Changed from 'products_id_seq' to 'app_products_id_seq'
        'orders_id_seq',
        'order_items_id_seq'
      ];

      for (const sequence of sequencesToDrop) {
        try {
          await this.userRepository.query(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE`);
          console.log(`Dropped sequence: ${sequence}`);
        } catch (seqError) {
          console.warn(`Could not drop sequence ${sequence}:`, seqError.message);
        }
      }

      // 4. Drop all MongoDB collections
      try {
        // Drop specific collections we know about
        await this.reviewModel.collection.drop();
        console.log('Dropped MongoDB collection: reviews');
        
        await this.logModel.collection.drop();
        console.log('Dropped MongoDB collection: logs');
      } catch (mongoError) {
        console.warn('Could not drop some MongoDB collections (they may not exist):', mongoError.message);
      }

      // 5. Clear any remaining indexes
      try {
        await this.reviewModel.collection.dropIndexes();
        await this.logModel.collection.dropIndexes();
        console.log('Dropped MongoDB indexes');
      } catch (indexError) {
        console.warn('Could not drop indexes:', indexError.message);
      }

      console.log('HARD database reset completed successfully');
      console.log('⚠️  All tables, sequences, enum types, and collections have been PERMANENTLY DELETED!');
      console.log('🔄 Use recreate-schema endpoint to recreate tables with proper structure.');
      
      return {
        success: true,
        message: 'HARD database reset completed! All PostgreSQL tables, sequences, enum types, and MongoDB collections permanently deleted. Use recreate-schema to rebuild.'
      };
    } catch (error) {
      console.error('Hard database reset failed:', error);
      return {
        success: false,
        message: `Hard database reset failed: ${error.message}`
      };
    }
  }

  // Test connectivity
  async testConnections(): Promise<{ 
    postgres: boolean; 
    mongodb: boolean; 
    collections: { 
      users: number; 
      products: number; 
      categories: number;
      orders: number;
      orderItems: number;
      reviews: number; 
      logs: number; 
    } 
  }> {
    let postgresConnected = false;
    let mongodbConnected = false;
    let userCount = 0, productCount = 0, categoryCount = 0, orderCount = 0, orderItemCount = 0;
    let reviewCount = 0, logCount = 0;

    try {
      // Test PostgreSQL basic connection first
      await this.userRepository.count();
      await this.productRepository.count();
      await this.categoryRepository.count();
      
      userCount = await this.userRepository.count();
      productCount = await this.productRepository.count();
      categoryCount = await this.categoryRepository.count();
      postgresConnected = true;
      
      // Try order tables but handle potential schema issues
      try {
        orderCount = await this.orderRepository.count();
        orderItemCount = await this.orderItemRepository.count();
      } catch (orderError) {
        console.warn('Order tables have schema issues, but basic PostgreSQL connection works:', orderError.message);
        orderCount = 0;
        orderItemCount = 0;
      }
    } catch (pgError) {
      console.error('PostgreSQL connection failed:', pgError);
      postgresConnected = false;
    }

    try {
      // Test MongoDB collections
      reviewCount = await this.reviewModel.countDocuments();
      logCount = await this.logModel.countDocuments();
      mongodbConnected = true;
    } catch (mongoError) {
      console.error('MongoDB connection failed:', mongoError);
      mongodbConnected = false;
    }

    return {
      postgres: postgresConnected,
      mongodb: mongodbConnected,
      collections: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        orders: orderCount,
        orderItems: orderItemCount,
        reviews: reviewCount,
        logs: logCount,
      },
    };
  }

  // Manually recreate database schema - useful after hard reset
  async recreateSchema(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting manual schema recreation...');
      
      // First, create enum types that match the entities
      await this.userRepository.query(`
        DO $$ BEGIN
          CREATE TYPE "role_enum" AS ENUM ('admin', 'customer');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log('Created role_enum type');

      await this.orderRepository.query(`
        DO $$ BEGIN
          CREATE TYPE "order_status_enum" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log('Created order_status_enum type');

      await this.orderRepository.query(`
        DO $$ BEGIN
          CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log('Created payment_status_enum type');
      
      // Create tables manually using raw SQL matching the exact entity definitions
      // 1. Create users table (app_users) - matches User entity
      await this.userRepository.query(`
        CREATE TABLE IF NOT EXISTS "app_users" (
          "id" SERIAL PRIMARY KEY,
          "email" VARCHAR UNIQUE NOT NULL,
          "password" VARCHAR NOT NULL,
          "firstName" VARCHAR NOT NULL,
          "lastName" VARCHAR NOT NULL,
          "role" "role_enum" NOT NULL DEFAULT 'customer',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('Created app_users table');

      // 2. Create categories table - matches Category entity
      await this.categoryRepository.query(`
        CREATE TABLE IF NOT EXISTS "categories" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR UNIQUE NOT NULL,
          "description" TEXT,
          "slug" VARCHAR,
          "image" VARCHAR,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "sortOrder" INTEGER DEFAULT 0,
          "metadata" JSONB,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('Created categories table');

      // 3. Create products table (app_products) - matches Product entity
      await this.productRepository.query(`
        CREATE TABLE IF NOT EXISTS "app_products" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR NOT NULL,
          "description" TEXT NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "stock" INTEGER NOT NULL,
          "images" TEXT[] DEFAULT '{}',
          "categoryId" INTEGER,
          "isAvailable" BOOLEAN NOT NULL DEFAULT true,
          "metadata" JSONB,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL
        )
      `);
      console.log('Created app_products table');

      // 4. Create orders table - matches Order entity
      await this.orderRepository.query(`
        CREATE TABLE IF NOT EXISTS "orders" (
          "id" SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          "orderNumber" VARCHAR UNIQUE NOT NULL,
          "status" "order_status_enum" NOT NULL DEFAULT 'pending',
          "paymentStatus" "payment_status_enum" NOT NULL DEFAULT 'pending',
          "subtotal" DECIMAL(10,2) NOT NULL,
          "taxAmount" DECIMAL(10,2) DEFAULT 0,
          "shippingAmount" DECIMAL(10,2) DEFAULT 0,
          "discountAmount" DECIMAL(10,2) DEFAULT 0,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          "currency" VARCHAR,
          "shippingAddress" JSONB,
          "billingAddress" JSONB,
          "paymentMethod" VARCHAR,
          "paymentReference" VARCHAR,
          "trackingNumber" VARCHAR,
          "notes" TEXT,
          "metadata" JSONB,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE
        )
      `);
      console.log('Created orders table');

      // 5. Create order_items table - matches OrderItem entity
      await this.orderItemRepository.query(`
        CREATE TABLE IF NOT EXISTS "order_items" (
          "id" SERIAL PRIMARY KEY,
          "orderId" INTEGER NOT NULL,
          "productId" INTEGER NOT NULL,
          "quantity" INTEGER NOT NULL,
          "unitPrice" DECIMAL(10,2) NOT NULL,
          "totalPrice" DECIMAL(10,2) NOT NULL,
          "productSnapshot" JSONB,
          FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE,
          FOREIGN KEY ("productId") REFERENCES "app_products"("id") ON DELETE CASCADE
        )
      `);
      console.log('Created order_items table');

      console.log('Manual schema recreation completed successfully');
      
      return {
        success: true,
        message: 'Database schema recreated successfully with proper enum types. All tables match entity definitions exactly.'
      };
    } catch (error) {
      console.error('Schema recreation failed:', error);
      return {
        success: false,
        message: `Schema recreation failed: ${error.message}`
      };
    }
  }

  // Seed default users for testing
  async seedDefaultUsers(): Promise<{ message: string; users: Partial<User>[] }> {
    const defaultUsers = [
      {
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
      },
      {
        email: 'customer@test.com',
        password: 'customer123',
        firstName: 'Test',
        lastName: 'Customer',
        role: Role.CUSTOMER,
      },
    ];

    const createdUsers: Partial<User>[] = [];

    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await this.findUserByEmail(userData.email);
        
        if (!existingUser) {
          // Hash password
          const bcrypt = require('bcrypt');
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

          // Create user
          const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
          });

          const savedUser = await this.userRepository.save(user);
          
          // Remove password from response
          const { password, ...userResponse } = savedUser;
          createdUsers.push(userResponse);
        } else {
          // User already exists, add to response without password
          const { password, ...userResponse } = existingUser;
          createdUsers.push(userResponse);
        }
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
      }
    }

    return {
      message: 'Default users seeded successfully',
      users: createdUsers,
    };
  }
}
