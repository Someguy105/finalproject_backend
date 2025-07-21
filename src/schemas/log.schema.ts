import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export enum LogCategory {
  USER_ACTION = 'user_action',
  SYSTEM = 'system',
  API_REQUEST = 'api_request',
  DATABASE = 'database',
  PAYMENT = 'payment',
  SECURITY = 'security',
  ERROR = 'error',
}

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true, enum: LogLevel })
  level: LogLevel;

  @Prop({ required: true, enum: LogCategory })
  category: LogCategory;

  @Prop({ required: true })
  message: string;

  @Prop()
  userId: string;

  @Prop()
  sessionId: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  endpoint: string;

  @Prop()
  method: string;

  @Prop()
  statusCode: number;

  @Prop()
  responseTime: number;

  @Prop({ type: Object })
  requestData: Record<string, any>;

  @Prop({ type: Object })
  responseData: Record<string, any>;

  @Prop({ type: Object })
  errorDetails: Record<string, any>;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: Date.now, expires: '90d' }) // Auto-delete logs after 90 days
  expiresAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
