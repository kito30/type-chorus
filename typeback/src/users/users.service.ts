import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: { username: string; email: string; password: string }) {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password -refreshTokenHash');
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    return this.userModel.findByIdAndUpdate(userId, { refreshTokenHash });
  }

  async updateStats(userId: string, score: number) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    user.stats.gamesPlayed += 1;
    user.stats.totalScore += score;
    user.stats.highestScore = Math.max(user.stats.highestScore, score);
    
    return user.save();
  }

  async updateProfile(userId: string, updateData: { username?: string; email?: string }) {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshTokenHash');
  }
}
