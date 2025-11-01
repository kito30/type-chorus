import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private gameService;
    server: Server;
    constructor(gameService: GameService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinGame(client: Socket, data: {
        gameId: string;
        userId: string;
        username: string;
    }): Promise<void>;
    handleReady(client: Socket, data: {
        gameId: string;
        userId: string;
    }): Promise<void>;
    handleTypingProgress(client: Socket, data: {
        gameId: string;
        userId: string;
        currentIndex: number;
        timeMs: number;
        correct: boolean;
        score: number;
    }): Promise<void>;
    handleGameComplete(client: Socket, data: {
        gameId: string;
        userId: string;
        finalScore: number;
    }): Promise<void>;
}
