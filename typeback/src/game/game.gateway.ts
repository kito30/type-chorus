import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-game')
  async handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string; username: string },
  ) {
    const session = await this.gameService.joinSession(data.gameId, data.userId, data.username, client.id);
    
    if (!session) {
      client.emit('error', { message: 'Game not found' });
      return;
    }

    client.join(data.gameId);
    
    this.server.to(data.gameId).emit('player-joined', {
      user: { userId: data.userId, username: data.username },
      players: session.players,
    });
  }

  @SubscribeMessage('ready')
  async handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string },
  ) {
    const session = await this.gameService.setPlayerReady(data.gameId, data.userId);
    
    if (!session) return;

    this.server.to(data.gameId).emit('player-ready', {
      userId: data.userId,
      players: session.players,
    });

    // Check if all players ready
    const allReady = session.players.every(p => p.ready);
    if (allReady && session.players.length > 1) {
      // Start countdown
      setTimeout(async () => {
        await this.gameService.startGame(data.gameId);
        this.server.to(data.gameId).emit('game-start', {
          startAt: Date.now() + 3000, // 3 second countdown
        });
      }, 1000);
    }
  }

  @SubscribeMessage('typing-progress')
  async handleTypingProgress(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string; currentIndex: number; timeMs: number; correct: boolean; score: number },
  ) {
    await this.gameService.updateProgress(data.gameId, data.userId, data.score);
    
    client.to(data.gameId).emit('progress-update', {
      playerId: data.userId,
      index: data.currentIndex,
      score: data.score,
      timeMs: data.timeMs,
    });
  }

  @SubscribeMessage('game-complete')
  async handleGameComplete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string; finalScore: number },
  ) {
    const session = await this.gameService.completeGame(data.gameId);
    
    if (!session) return;

    this.server.to(data.gameId).emit('game-end', {
      results: session.players.map(p => ({
        userId: p.userId,
        username: p.username,
        score: p.score,
      })).sort((a, b) => b.score - a.score),
    });
  }
}
