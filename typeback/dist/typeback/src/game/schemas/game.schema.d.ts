import { Document } from 'mongoose';
export declare class Game extends Document {
    userId?: string;
    lyricsId: string;
    score: number;
    durationMs: number;
    gameType: string;
    gameSessionId?: string;
    details: any;
}
export declare const GameSchema: import("mongoose").Schema<Game, import("mongoose").Model<Game, any, any, any, Document<unknown, any, Game, any, {}> & Game & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Game, Document<unknown, {}, import("mongoose").FlatRecord<Game>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Game> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class GameSession extends Document {
    hostUserId: string;
    lyricsId: string;
    players: Array<{
        userId: string;
        username: string;
        socketId: string;
        ready: boolean;
        score: number;
    }>;
    status: string;
    startedAt?: Date;
    completedAt?: Date;
    gameState: any;
}
export declare const GameSessionSchema: import("mongoose").Schema<GameSession, import("mongoose").Model<GameSession, any, any, any, Document<unknown, any, GameSession, any, {}> & GameSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GameSession, Document<unknown, {}, import("mongoose").FlatRecord<GameSession>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<GameSession> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
