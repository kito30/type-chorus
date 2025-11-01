import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

// normalize JWT expiresIn to either a number (when env is numeric) or a string
const rawJwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
const jwtExpiresIn = /^\d+$/.test(rawJwtExpiresIn) ? Number(rawJwtExpiresIn) : rawJwtExpiresIn;

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: jwtExpiresIn as any },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}