// Import crypto polyfill before anything else
import './crypto-polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Log, LogSchema } from './schemas/log.schema';
import { AuthModule } from './auth/auth.module';
import { 
  HttpExceptionFilter, 
  DatabaseExceptionFilter,
  ResponseTimeInterceptor,
  ApiResponseInterceptor 
} from './common';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // PostgreSQL (Neon) Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        ssl: configService.get('DB_SSL') === 'true',
        synchronize: configService.get('DB_SYNC') !== 'false', // Allow disabling sync via env var
        logging: false, // Disable logging in production
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        retryAttempts: 3,
        retryDelay: 3000,
        extra: {
          // Add connection pool settings for better reliability
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
      inject: [ConfigService],
    }),
    
    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    
    // Register TypeORM entities
    TypeOrmModule.forFeature([User, Product, Category, Order, OrderItem]),
    
    // Register Mongoose schemas
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    
    // Auth Module
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    DatabaseService,
    
    // Global Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
