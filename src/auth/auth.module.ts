import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { Log, LogSchema } from '../schemas/log.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET loaded:', secret ? 'YES' : 'NO');
        if (!secret) {
          throw new Error('JWT_SECRET is not configured');
        }
        return {
          secret: secret,
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Product, Category, Order, OrderItem]),
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Log.name, schema: LogSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
