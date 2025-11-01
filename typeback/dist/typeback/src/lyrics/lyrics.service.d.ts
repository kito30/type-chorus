import { Model } from 'mongoose';
import { Lyrics } from './schemas/lyrics.schema';
export declare class LyricsService {
    private lyricsModel;
    constructor(lyricsModel: Model<Lyrics>);
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Lyrics, {}, {}> & Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Lyrics, {}, {}> & Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    create(lyricsData: any): Promise<import("mongoose").Document<unknown, {}, Lyrics, {}, {}> & Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
