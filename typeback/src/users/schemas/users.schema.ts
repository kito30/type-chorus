import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object, default: { gamesPlayed: 0, totalScore: 0, highestScore: 0 } })
  stats: {
    gamesPlayed: number;
    totalScore: number;
    highestScore: number;
  };

  @Prop()
  refreshTokenHash?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);