import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameSession } from './schemas/game.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(GameSession.name) private gameSessionModel: Model<GameSession>,
    private usersService: UsersService,
  ) {}

  // Single-player game result
  async saveResult(resultData: { userId?: string; lyricsId: string; score: number; durationMs: number }) {
    const game = new this.gameModel({
      ...resultData,
      gameType: 'single',
    });

    await game.save();

    // Update user stats if userId provided
    if (resultData.userId) {
      await this.usersService.updateStats(resultData.userId, resultData.score);
    }

    return game;
  }

  // Multiplayer: Create game session
  async createSession(hostUserId: string, lyricsId: string) {
    const session = new this.gameSessionModel({
      hostUserId,
      lyricsId,
      status: 'waiting',
    });

    return session.save();
  }

  // Multiplayer: Join session
  async joinSession(gameId: string, userId: string, username: string, socketId: string) {
    const session = await this.gameSessionModel.findById(gameId);
    if (!session) return null;

    const existingPlayer = session.players.find(p => p.userId === userId);
    if (!existingPlayer) {
      session.players.push({ userId, username, socketId, ready: false, score: 0 });
      await session.save();
    }

    return session;
  }

  // Get session
  async getSession(gameId: string) {
    return this.gameSessionModel.findById(gameId);
  }

  // Update player ready status
  async setPlayerReady(gameId: string, userId: string) {
    const session = await this.gameSessionModel.findById(gameId);
    if (!session) return null;

    const player = session.players.find(p => p.userId === userId);
    if (player) {
      player.ready = true;
      await session.save();
    }

    return session;
  }

  // Start game
  async startGame(gameId: string) {
    const session = await this.gameSessionModel.findById(gameId);
    if (!session) return null;

    session.status = 'in-progress';
    session.startedAt = new Date();
    await session.save();

    return session;
  }

  // Update player progress
  async updateProgress(gameId: string, userId: string, score: number) {
    const session = await this.gameSessionModel.findById(gameId);
    if (!session) return null;

    const player = session.players.find(p => p.userId === userId);
    if (player) {
      player.score = score;
      await session.save();
    }

    return session;
  }

  // Complete game
  async completeGame(gameId: string) {
    const session = await this.gameSessionModel.findById(gameId);
    if (!session) return null;

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    return session;
  }
}