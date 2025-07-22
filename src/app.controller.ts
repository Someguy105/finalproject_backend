import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';
import { LogLevel, LogCategory } from './schemas/log.schema';
import { JwtAuthGuard, RolesGuard, Roles, Role, CurrentUser, ParseMongoIdPipe } from './common';
import { JwtPayload } from './auth/interfaces/jwt-payload.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  getFavicon(): void {
    // Return empty response for favicon requests to prevent 404 errors
    return;
  }

  @Get('health/db')
  async testDatabaseConnections() {
    return await this.databaseService.testConnections();
  }

  @Post('admin/reset-database')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async resetDatabase(@CurrentUser() user: JwtPayload) {
    console.log(`Database reset requested by admin user: ${user.email}`);
    return await this.databaseService.resetDatabase();
  }

  @Post('dev/reset-database')
  async resetDatabaseDev() {
    // Only allow in development/testing environments
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Database reset not allowed in production' };
    }
    console.log('Development database reset requested');
    return await this.databaseService.resetDatabase();
  }

  @Post('dev/hard-reset-database')
  async hardResetDatabaseDev() {
    // Only allow in development/testing environments
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Hard database reset not allowed in production' };
    }
    console.log('Development HARD database reset requested - This will DROP ALL TABLES!');
    return await this.databaseService.hardResetDatabase();
  }

  @Post('admin/hard-reset-database')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async hardResetDatabase(@CurrentUser() user: JwtPayload) {
    console.log(`HARD database reset requested by admin user: ${user.email} - This will DROP ALL TABLES!`);
    return await this.databaseService.hardResetDatabase();
  }

  @Post('dev/seed-users')
  async seedDefaultUsers() {
    console.log('Seeding default users...');
    return await this.databaseService.seedDefaultUsers();
  }

  @Post('admin/seed-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async seedDefaultUsersAdmin(@CurrentUser() user: JwtPayload) {
    console.log(`Seed users requested by admin user: ${user.email}`);
    return await this.databaseService.seedDefaultUsers();
  }

  @Get('users')
  async getUsers() {
    return await this.databaseService.findAllUsers();
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    return await this.databaseService.createUser(userData);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return await this.databaseService.findUserById(parseInt(id));
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.databaseService.updateUser(parseInt(id), userData);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.databaseService.deleteUser(parseInt(id));
  }

  // Product endpoints (PostgreSQL)
  @Get('products')
  async getProducts() {
    return await this.databaseService.findAllProducts();
  }

  @Post('products')
  async createProduct(@Body() productData: any) {
    return await this.databaseService.createProduct(productData);
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return await this.databaseService.findProductById(parseInt(id));
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() productData: any) {
    return await this.databaseService.updateProduct(parseInt(id), productData);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.databaseService.deleteProduct(parseInt(id));
  }

  // Category endpoints (PostgreSQL)
  @Get('categories')
  async getCategories() {
    return await this.databaseService.findAllCategories();
  }

  @Post('categories')
  async createCategory(@Body() categoryData: any) {
    return await this.databaseService.createCategory(categoryData);
  }

  @Get('categories/:id')
  async getCategory(@Param('id') id: string) {
    return await this.databaseService.findCategoryById(parseInt(id));
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    return await this.databaseService.updateCategory(parseInt(id), categoryData);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.databaseService.deleteCategory(parseInt(id));
  }

  // Order endpoints (PostgreSQL)
  @Get('orders')
  async getOrders() {
    return await this.databaseService.findAllOrders();
  }

  @Post('orders')
  async createOrder(@Body() orderData: any) {
    return await this.databaseService.createOrder(orderData);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return await this.databaseService.findOrderById(parseInt(id));
  }

  @Get('orders/user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return await this.databaseService.findOrdersByUser(parseInt(userId));
  }

  @Put('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() orderData: any) {
    return await this.databaseService.updateOrder(parseInt(id), orderData);
  }

  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return await this.databaseService.deleteOrder(parseInt(id));
  }

  // OrderItem endpoints (PostgreSQL)
  @Get('order-items')
  async getOrderItems() {
    return await this.databaseService.findAllOrderItems();
  }

  @Post('order-items')
  async createOrderItem(@Body() orderItemData: any) {
    return await this.databaseService.createOrderItem(orderItemData);
  }

  @Get('order-items/:id')
  async getOrderItem(@Param('id') id: string) {
    return await this.databaseService.findOrderItemById(parseInt(id));
  }

  @Get('order-items/order/:orderId')
  async getOrderItemsByOrder(@Param('orderId') orderId: string) {
    return await this.databaseService.findOrderItemsByOrder(parseInt(orderId));
  }

  @Put('order-items/:id')
  async updateOrderItem(@Param('id') id: string, @Body() orderItemData: any) {
    return await this.databaseService.updateOrderItem(parseInt(id), orderItemData);
  }

  @Delete('order-items/:id')
  async deleteOrderItem(@Param('id') id: string) {
    return await this.databaseService.deleteOrderItem(parseInt(id));
  }

  // Review endpoints
  @Get('reviews')
  async getReviews() {
    return await this.databaseService.findAllReviews();
  }

  @Post('reviews')
  async createReview(@Body() reviewData: any) {
    return await this.databaseService.createReview(reviewData);
  }

  @Get('reviews/product/:productId')
  async getReviewsByProduct(@Param('productId') productId: string) {
    return await this.databaseService.findReviewsByProduct(productId);
  }

  @Get('reviews/user/:userId')
  async getReviewsByUser(@Param('userId') userId: string) {
    return await this.databaseService.findReviewsByUser(userId);
  }

  @Post('reviews/:id/helpful')
  async markReviewHelpful(@Param('id') id: string) {
    return await this.databaseService.updateReviewHelpfulCount(id, true);
  }

  @Get('reviews/:id')
  async getReview(@Param('id') id: string) {
    return await this.databaseService.findReviewById(id);
  }

  @Put('reviews/:id')
  async updateReview(@Param('id') id: string, @Body() reviewData: any) {
    return await this.databaseService.updateReview(id, reviewData);
  }

  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return await this.databaseService.deleteReview(id);
  }

  // Log endpoints
  @Get('logs')
  async getLogs(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return await this.databaseService.findAllLogs(limitNum);
  }

  @Post('logs')
  async createLog(@Body() logData: any) {
    return await this.databaseService.createLog(logData);
  }

  @Get('logs/level/:level')
  async getLogsByLevel(@Param('level') level: LogLevel, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return await this.databaseService.findLogsByLevel(level, limitNum);
  }

  @Get('logs/category/:category')
  async getLogsByCategory(@Param('category') category: LogCategory, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return await this.databaseService.findLogsByCategory(category, limitNum);
  }

  @Get('logs/user/:userId')
  async getLogsByUser(@Param('userId') userId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return await this.databaseService.findLogsByUser(userId, limitNum);
  }

  @Get('logs/:id')
  async getLog(@Param('id') id: string) {
    return await this.databaseService.findLogById(id);
  }

  @Put('logs/:id')
  async updateLog(@Param('id') id: string, @Body() logData: any) {
    return await this.databaseService.updateLog(id, logData);
  }

  @Delete('logs/:id')
  async deleteLog(@Param('id') id: string) {
    return await this.databaseService.deleteLog(id);
  }

  // Protected routes examples
  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminUsers(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Admin access granted',
      user: user,
      data: await this.databaseService.findAllUsers()
    };
  }

  @Get('customer/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  async getCustomerProfile(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Customer profile access',
      user: user
    };
  }

  @Get('reviews/:id/mongo')
  async getReviewWithMongoValidation(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.databaseService.findReviewById(id);
  }
}
