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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const game_schema_1 = require("./schemas/game.schema");
const users_service_1 = require("../users/users.service");
let GameService = class GameService {
    constructor(gameModel, gameSessionModel, usersService) {
        this.gameModel = gameModel;
        this.gameSessionModel = gameSessionModel;
        this.usersService = usersService;
    }
    async saveResult(resultData) {
        const game = new this.gameModel({
            ...resultData,
            gameType: 'single',
        });
        await game.save();
        if (resultData.userId) {
            await this.usersService.updateStats(resultData.userId, resultData.score);
        }
        return game;
    }
    async createSession(hostUserId, lyricsId) {
        const session = new this.gameSessionModel({
            hostUserId,
            lyricsId,
            status: 'waiting',
        });
        return session.save();
    }
    async joinSession(gameId, userId, username, socketId) {
        const session = await this.gameSessionModel.findById(gameId);
        if (!session)
            return null;
        const existingPlayer = session.players.find(p => p.userId === userId);
        if (!existingPlayer) {
            session.players.push({ userId, username, socketId, ready: false, score: 0 });
            await session.save();
        }
        return session;
    }
    async getSession(gameId) {
        return this.gameSessionModel.findById(gameId);
    }
    async setPlayerReady(gameId, userId) {
        const session = await this.gameSessionModel.findById(gameId);
        if (!session)
            return null;
        const player = session.players.find(p => p.userId === userId);
        if (player) {
            player.ready = true;
            await session.save();
        }
        return session;
    }
    async startGame(gameId) {
        const session = await this.gameSessionModel.findById(gameId);
        if (!session)
            return null;
        session.status = 'in-progress';
        session.startedAt = new Date();
        await session.save();
        return session;
    }
    async updateProgress(gameId, userId, score) {
        const session = await this.gameSessionModel.findById(gameId);
        if (!session)
            return null;
        const player = session.players.find(p => p.userId === userId);
        if (player) {
            player.score = score;
            await session.save();
        }
        return session;
    }
    async completeGame(gameId) {
        const session = await this.gameSessionModel.findById(gameId);
        if (!session)
            return null;
        session.status = 'completed';
        session.completedAt = new Date();
        await session.save();
        return session;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Game.name)),
    __param(1, (0, mongoose_1.InjectModel)(game_schema_1.GameSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], GameService);
//# sourceMappingURL=game.service.js.map