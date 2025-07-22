import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Log, LogDocument, LogLevel, LogCategory } from './schemas/log.schema';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @InjectModel(Log.name)
    private logModel: Model<LogDocument>,
  ) {}

  async seedAllData(): Promise<{ message: string; summary: any }> {
    try {
      // Get existing users for relationships
      const users = await this.userRepository.find();
      if (users.length === 0) {
        throw new Error('No users found. Please seed users first.');
      }

      const admin = users.find(u => u.role === 'admin');
      const customers = users.filter(u => u.role === 'customer');

      // 1. Seed Categories
      const categories = await this.seedCategories();
      
      // 2. Seed Products
      const products = await this.seedProducts(categories);
      
      // 3. Seed Orders
      const orders = await this.seedOrders(customers);
      
      // 4. Seed Order Items
      const orderItems = await this.seedOrderItems(orders, products);
      
      // 5. Seed Reviews
      const reviews = await this.seedReviews(customers, products);
      
      // 6. Seed Logs
      const logs = await this.seedLogs(admin || users[0]);

      const summary = {
        categories: categories.length,
        products: products.length,
        orders: orders.length,
        orderItems: orderItems.length,
        reviews: reviews.length,
        logs: logs.length,
      };

      return {
        message: 'All seed data created successfully',
        summary,
      };
    } catch (error) {
      throw new Error(`Failed to seed data: ${error.message}`);
    }
  }

  private async seedCategories(): Promise<Category[]> {
    // Check if categories already exist
    const existingCount = await this.categoryRepository.count();
    if (existingCount > 0) {
      return await this.categoryRepository.find();
    }

    const categoryData = [
      {
        name: 'Electronics',
        description: 'Electronic devices, gadgets, and accessories'
      },
      {
        name: 'Clothing',
        description: 'Fashion apparel and accessories for all ages'
      },
      {
        name: 'Books',
        description: 'Physical and digital books, magazines, and educational materials'
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement, furniture, and gardening supplies'
      }
    ];

    const categories = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(categories);
  }

  private async seedProducts(categories: Category[]): Promise<Product[]> {
    // Check if products already exist
    const existingCount = await this.productRepository.count();
    if (existingCount > 0) {
      return await this.productRepository.find();
    }

    const productData = [
      {
        name: 'Gaming Laptop Pro',
        description: 'High-performance gaming laptop with RTX 4080 graphics card, 32GB RAM, and 1TB SSD',
        price: 2499.99,
        stock: 25,
        category: categories[0], // Electronics
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
        metadata: { featured: true }
      },
      {
        name: 'Premium Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with 30-hour battery life',
        price: 299.99,
        stock: 50,
        category: categories[0], // Electronics
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        metadata: { featured: false }
      },
      {
        name: 'Designer Winter Jacket',
        description: 'Premium waterproof winter jacket with down insulation',
        price: 189.99,
        stock: 30,
        category: categories[1], // Clothing
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
        metadata: { featured: true }
      },
      {
        name: 'Programming Complete Guide',
        description: 'Comprehensive guide to modern web development and programming languages',
        price: 49.99,
        stock: 100,
        category: categories[2], // Books
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
        metadata: { featured: false }
      }
    ];

    const products = this.productRepository.create(productData);
    return await this.productRepository.save(products);
  }

  private async seedOrders(customers: User[]): Promise<Order[]> {
    // Check if orders already exist
    const existingCount = await this.orderRepository.count();
    if (existingCount > 0) {
      return await this.orderRepository.find();
    }

    const orderData = [
      {
        user: customers[0],
        orderNumber: 'ORD-2025-001',
        subtotal: 2599.98,
        taxAmount: 199.99,
        shippingAmount: 0,
        discountAmount: 0,
        totalAmount: 2799.97,
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '123 Tech Street',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94025',
          country: 'USA'
        },
        paymentMethod: 'credit_card',
        currency: 'USD'
      },
      {
        user: customers[1] || customers[0],
        orderNumber: 'ORD-2025-002',
        subtotal: 189.99,
        taxAmount: 15.20,
        shippingAmount: 9.99,
        discountAmount: 0,
        totalAmount: 215.18,
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '456 Fashion Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'paypal',
        currency: 'USD'
      },
      {
        user: customers[0],
        orderNumber: 'ORD-2025-003',
        subtotal: 49.99,
        taxAmount: 4.00,
        shippingAmount: 5.99,
        discountAmount: 0,
        totalAmount: 59.98,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: {
          street: '789 Book Lane',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        paymentMethod: 'bank_transfer',
        currency: 'USD'
      },
      {
        user: customers[1] || customers[0],
        orderNumber: 'ORD-2025-004',
        subtotal: 299.99,
        taxAmount: 24.00,
        shippingAmount: 0,
        discountAmount: 25.00,
        totalAmount: 298.99,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '321 Audio Drive',
          city: 'Nashville',
          state: 'TN',
          zipCode: '37201',
          country: 'USA'
        },
        paymentMethod: 'credit_card',
        currency: 'USD'
      }
    ];

    const orders = this.orderRepository.create(orderData);
    return await this.orderRepository.save(orders);
  }

  private async seedOrderItems(orders: Order[], products: Product[]): Promise<OrderItem[]> {
    // Check if order items already exist
    const existingCount = await this.orderItemRepository.count();
    if (existingCount > 0) {
      return await this.orderItemRepository.find();
    }

    const orderItemData = [
      // Order 1: Gaming Laptop + Headphones
      {
        order: orders[0],
        product: products[0], // Gaming Laptop
        quantity: 1,
        price: 2499.99
      },
      {
        order: orders[0],
        product: products[1], // Headphones
        quantity: 1,
        price: 299.99
      },
      // Order 2: Winter Jacket
      {
        order: orders[1],
        product: products[2], // Winter Jacket
        quantity: 1,
        price: 189.99
      },
      // Order 3: Programming Book
      {
        order: orders[2],
        product: products[3], // Book
        quantity: 1,
        price: 49.99
      },
      // Order 4: Headphones
      {
        order: orders[3],
        product: products[1], // Headphones
        quantity: 1,
        price: 299.99
      }
    ];

    const orderItems = this.orderItemRepository.create(orderItemData);
    return await this.orderItemRepository.save(orderItems);
  }

  private async seedReviews(customers: User[], products: Product[]): Promise<any[]> {
    // Check if reviews already exist
    const existingCount = await this.reviewModel.countDocuments();
    if (existingCount > 0) {
      return await this.reviewModel.find().lean();
    }

    const reviewData = [
      {
        productId: products[0].id, // Gaming Laptop
        userId: customers[0].id.toString(),
        rating: 5,
        title: 'Outstanding Gaming Performance',
        comment: 'This laptop exceeded my expectations! The RTX 4080 handles every game at max settings. Perfect for both gaming and professional work.',
        isVerified: true,
        metadata: {
          userName: `${customers[0].firstName} ${customers[0].lastName}`,
          userEmail: customers[0].email
        }
      },
      {
        productId: products[1].id, // Headphones
        userId: (customers[1]?.id || customers[0].id).toString(),
        rating: 4,
        title: 'Great Sound Quality',
        comment: 'Excellent noise cancellation and battery life. Very comfortable for long listening sessions. Only minor complaint is they can get warm after hours of use.',
        isVerified: true,
        metadata: {
          userName: customers[1] ? `${customers[1].firstName} ${customers[1].lastName}` : `${customers[0].firstName} ${customers[0].lastName}`,
          userEmail: customers[1]?.email || customers[0].email
        }
      },
      {
        productId: products[2].id, // Winter Jacket
        userId: customers[0].id.toString(),
        rating: 5,
        title: 'Perfect for Cold Weather',
        comment: 'Kept me warm during a -10°F winter trip. Waterproof and breathable. The design is stylish too. Highly recommend!',
        isVerified: true,
        metadata: {
          userName: `${customers[0].firstName} ${customers[0].lastName}`,
          userEmail: customers[0].email
        }
      },
      {
        productId: products[3].id, // Book
        userId: (customers[1]?.id || customers[0].id).toString(),
        rating: 4,
        title: 'Comprehensive Programming Guide',
        comment: 'Well-structured content covering modern web development. Good for both beginners and intermediate developers. Some advanced topics could be explained better.',
        isVerified: false,
        metadata: {
          userName: customers[1] ? `${customers[1].firstName} ${customers[1].lastName}` : `${customers[0].firstName} ${customers[0].lastName}`,
          userEmail: customers[1]?.email || customers[0].email
        }
      }
    ];

    return await this.reviewModel.insertMany(reviewData);
  }

  private async seedLogs(admin: User): Promise<any[]> {
    // Check if logs already exist
    const existingCount = await this.logModel.countDocuments();
    if (existingCount > 0) {
      return await this.logModel.find().lean();
    }

    const logData = [
      {
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM,
        message: 'Database seed data initialization completed',
        userId: admin?.id?.toString(),
        metadata: {
          action: 'seed_data',
          status: 'success',
          timestamp: new Date(),
          categories: 4,
          products: 4,
          orders: 4,
          reviews: 4,
          context: 'SeedDataService',
          userEmail: admin?.email
        }
      },
      {
        level: LogLevel.INFO,
        category: LogCategory.USER_ACTION,
        message: 'User authentication successful',
        userId: admin?.id?.toString(),
        metadata: {
          action: 'login',
          userAgent: 'PostmanRuntime/7.36.0',
          ip: '127.0.0.1',
          timestamp: new Date(),
          context: 'AuthService',
          userEmail: admin?.email
        }
      },
      {
        level: LogLevel.WARN,
        category: LogCategory.API_REQUEST,
        message: 'High number of API requests detected',
        metadata: {
          endpoint: '/api/products',
          requestCount: 150,
          timeWindow: '1 hour',
          threshold: 100,
          timestamp: new Date(),
          context: 'RateLimitMiddleware'
        }
      },
      {
        level: LogLevel.ERROR,
        category: LogCategory.PAYMENT,
        message: 'Failed payment processing attempt',
        metadata: {
          orderId: 'ORD-2025-001',
          paymentMethod: 'credit_card',
          amount: 299.99,
          errorCode: 'CARD_DECLINED',
          retryAttempt: 1,
          timestamp: new Date(),
          context: 'PaymentService'
        }
      }
    ];

    return await this.logModel.insertMany(logData);
  }
}
