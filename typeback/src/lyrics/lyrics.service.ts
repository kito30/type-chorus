import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lyrics } from './schemas/lyrics.schema';

@Injectable()
export class LyricsService {
  constructor(@InjectModel(Lyrics.name) private lyricsModel: Model<Lyrics>) {}

  async findById(id: string) {
    const lyrics = await this.lyricsModel.findById(id);
    if (!lyrics) {
      throw new NotFoundException('Lyrics not found');
    }
    return lyrics;
  }

  async findAll() {
    return this.lyricsModel.find();
  }

  async create(lyricsData: any) {
    const lyrics = new this.lyricsModel(lyricsData);
    return lyrics.save();
  }
}
