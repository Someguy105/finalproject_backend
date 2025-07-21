import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Number })
  productId: number; // Reference to PostgreSQL Product entity ID

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: false })
  isHelpful: boolean;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop([String])
  images: string[];

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
