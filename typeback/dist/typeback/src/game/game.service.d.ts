import { Model } from 'mongoose';
import { Game, GameSession } from './schemas/game.schema';
import { UsersService } from '../users/users.service';
export declare class GameService {
    private gameModel;
    private gameSessionModel;
    private usersService;
    constructor(gameModel: Model<Game>, gameSessionModel: Model<GameSession>, usersService: UsersService);
    saveResult(resultData: {
        userId?: string;
        lyricsId: string;
        score: number;
        durationMs: number;
    }): Promise<import("mongoose").Document<unknown, {}, Game, {}, {}> & Game & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createSession(hostUserId: string, lyricsId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    joinSession(gameId: string, userId: string, username: string, socketId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getSession(gameId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    setPlayerReady(gameId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    startGame(gameId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateProgress(gameId: string, userId: string, score: number): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    completeGame(gameId: string): Promise<import("mongoose").Document<unknown, {}, GameSession, {}, {}> & GameSession & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
