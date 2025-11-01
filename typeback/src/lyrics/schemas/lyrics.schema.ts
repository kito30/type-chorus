import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Lyrics extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ type: Array })
  syncedLyrics: Array<{ time: number; text: string }>;

  @Prop()
  plainLyrics: string;

  @Prop()
  duration: number;

  @Prop({ default: 'medium', enum: ['easy', 'medium', 'hard'] })
  difficulty: string;
}

export const LyricsSchema = SchemaFactory.createForClass(Lyrics);