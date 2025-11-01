import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): any;
    updateProfile(req: any, updateData: {
        username?: string;
        email?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/users.schema").User, {}, {}> & import("./schemas/users.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
