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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionSchema = exports.GameSession = exports.GameSchema = exports.Game = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Game = class Game extends mongoose_2.Document {
};
exports.Game = Game;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Game.prototype, "lyricsId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Game.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Game.prototype, "durationMs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'single', enum: ['single', 'multi'] }),
    __metadata("design:type", String)
], Game.prototype, "gameType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "gameSessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Game.prototype, "details", void 0);
exports.Game = Game = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Game);
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(Game);
let GameSession = class GameSession extends mongoose_2.Document {
};
exports.GameSession = GameSession;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GameSession.prototype, "hostUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GameSession.prototype, "lyricsId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], GameSession.prototype, "players", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'waiting', enum: ['waiting', 'starting', 'in-progress', 'completed'] }),
    __metadata("design:type", String)
], GameSession.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], GameSession.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], GameSession.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], GameSession.prototype, "gameState", void 0);
exports.GameSession = GameSession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GameSession);
exports.GameSessionSchema = mongoose_1.SchemaFactory.createForClass(GameSession);
//# sourceMappingURL=game.schema.js.map