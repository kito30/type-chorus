import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema, GameSession, GameSessionSchema } from './schemas/game.schema';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UsersModule } from '../users/users.module';
import { LyricsModule } from '../lyrics/lyrics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
    UsersModule,
    LyricsModule,
  ],
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}