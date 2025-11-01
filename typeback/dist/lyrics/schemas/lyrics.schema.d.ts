import { Document } from 'mongoose';
export declare class Lyrics extends Document {
    title: string;
    artist: string;
    syncedLyrics: Array<{
        time: number;
        text: string;
    }>;
    plainLyrics: string;
    duration: number;
    difficulty: string;
}
export declare const LyricsSchema: import("mongoose").Schema<Lyrics, import("mongoose").Model<Lyrics, any, any, any, Document<unknown, any, Lyrics, any, {}> & Lyrics & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lyrics, Document<unknown, {}, import("mongoose").FlatRecord<Lyrics>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Lyrics> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
