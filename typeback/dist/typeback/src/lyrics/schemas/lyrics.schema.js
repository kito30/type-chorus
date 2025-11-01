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
exports.LyricsSchema = exports.Lyrics = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Lyrics = class Lyrics extends mongoose_2.Document {
};
exports.Lyrics = Lyrics;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lyrics.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lyrics.prototype, "artist", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array }),
    __metadata("design:type", Array)
], Lyrics.prototype, "syncedLyrics", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lyrics.prototype, "plainLyrics", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Lyrics.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'medium', enum: ['easy', 'medium', 'hard'] }),
    __metadata("design:type", String)
], Lyrics.prototype, "difficulty", void 0);
exports.Lyrics = Lyrics = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lyrics);
exports.LyricsSchema = mongoose_1.SchemaFactory.createForClass(Lyrics);
//# sourceMappingURL=lyrics.schema.js.map