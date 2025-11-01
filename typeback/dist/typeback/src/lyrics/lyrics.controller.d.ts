import { LyricsService } from './lyrics.service';
export declare class LyricsController {
    private lyricsService;
    constructor(lyricsService: LyricsService);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/lyrics.schema").Lyrics, {}, {}> & import("./schemas/lyrics.schema").Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/lyrics.schema").Lyrics, {}, {}> & import("./schemas/lyrics.schema").Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    create(lyricsData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/lyrics.schema").Lyrics, {}, {}> & import("./schemas/lyrics.schema").Lyrics & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
