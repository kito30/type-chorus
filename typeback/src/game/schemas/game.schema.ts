import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Game extends Document {
  @Prop()
  userId?: string;

  @Prop({ required: true })
  lyricsId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  durationMs: number;

  @Prop({ default: 'single', enum: ['single', 'multi'] })
  gameType: string;

  @Prop()
  gameSessionId?: string;

  @Prop({ type: Object })
  details: any;
}

export const GameSchema = SchemaFactory.createForClass(Game);

@Schema({ timestamps: true })
export class GameSession extends Document {
  @Prop({ required: true })
  hostUserId: string;

  @Prop({ required: true })
  lyricsId: string;

  @Prop({ type: Array, default: [] })
  players: Array<{ userId: string; username: string; socketId: string; ready: boolean; score: number }>;

  @Prop({ default: 'waiting', enum: ['waiting', 'starting', 'in-progress', 'completed'] })
  status: string;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ type: Object, default: {} })
  gameState: any;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);