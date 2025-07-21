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
    return await this.categoryRepository.find({
      relations: ['products'],
      order: { sortOrder: 'ASC', name: 'ASC' }
    });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['products']
    });
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
    return await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOrderById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({ 
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product']
    });
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }
    });
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
    return await this.orderItemRepository.find({
      relations: ['product', 'order']
    });
  }

  async findOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      where: { orderId },
      relations: ['product']
    });
  }

  async findOrderItemById(id: number): Promise<OrderItem | null> {
    return await this.orderItemRepository.findOne({ 
      where: { id },
      relations: ['product', 'order']
    });
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
    try {
      // Test PostgreSQL
      const userCount = await this.userRepository.count();
      const productCount = await this.productRepository.count();
      const categoryCount = await this.categoryRepository.count();
      const orderCount = await this.orderRepository.count();
      const orderItemCount = await this.orderItemRepository.count();
      const postgresConnected = true;

      // Test MongoDB collections
      const reviewCount = await this.reviewModel.countDocuments();
      const logCount = await this.logModel.countDocuments();
      const mongodbConnected = true;

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
    } catch (error) {
      console.error('Database connection test failed:', error);
      return {
        postgres: false,
        mongodb: false,
        collections: {
          users: 0,
          products: 0,
          categories: 0,
          orders: 0,
          orderItems: 0,
          reviews: 0,
          logs: 0,
        },
      };
    }
  }
}
