import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<{
        user: any;
        accessToken: string;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        user: any;
        accessToken: string;
    }>;
    refresh(req: any, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
}
