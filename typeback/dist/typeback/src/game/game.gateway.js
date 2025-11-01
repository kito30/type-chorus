"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinGame(client, data) {
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
    async handleReady(client, data) {
        const session = await this.gameService.setPlayerReady(data.gameId, data.userId);
        if (!session)
            return;
        this.server.to(data.gameId).emit('player-ready', {
            userId: data.userId,
            players: session.players,
        });
        const allReady = session.players.every(p => p.ready);
        if (allReady && session.players.length > 1) {
            setTimeout(async () => {
                await this.gameService.startGame(data.gameId);
                this.server.to(data.gameId).emit('game-start', {
                    startAt: Date.now() + 3000,
                });
            }, 1000);
        }
    }
    async handleTypingProgress(client, data) {
        await this.gameService.updateProgress(data.gameId, data.userId, data.score);
        client.to(data.gameId).emit('progress-update', {
            playerId: data.userId,
            index: data.currentIndex,
            score: data.score,
            timeMs: data.timeMs,
        });
    }
    async handleGameComplete(client, data) {
        const session = await this.gameService.completeGame(data.gameId);
        if (!session)
            return;
        this.server.to(data.gameId).emit('game-end', {
            results: session.players.map(p => ({
                userId: p.userId,
                username: p.username,
                score: p.score,
            })).sort((a, b) => b.score - a.score),
        });
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing-progress'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleTypingProgress", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('game-complete'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleGameComplete", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map