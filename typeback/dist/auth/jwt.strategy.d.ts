import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/users.schema").User, {}, {}> & import("../users/schemas/users.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
export {};
