import { GameService } from './game.service';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    saveResult(resultData: {
        userId?: string;
        lyricsId: string;
        score: number;
        durationMs: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/game.schema").Game, {}, {}> & import("./schemas/game.schema").Game & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createSession(req: any, body: {
        lyricsId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/game.schema").GameSession, {}, {}> & import("./schemas/game.schema").GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    joinSession(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/game.schema").GameSession, {}, {}> & import("./schemas/game.schema").GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getSession(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/game.schema").GameSession, {}, {}> & import("./schemas/game.schema").GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
