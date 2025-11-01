import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lyrics, LyricsSchema } from './schemas/lyrics.schema';
import { LyricsService } from './lyrics.service';
import { LyricsController } from './lyrics.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lyrics.name, schema: LyricsSchema }])],
  providers: [LyricsService],
  controllers: [LyricsController],
  exports: [LyricsService],
})
export class LyricsModule {}
