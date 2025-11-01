import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LyricsService } from './lyrics.service';

@Controller('lyrics')
export class LyricsController {
  constructor(private lyricsService: LyricsService) {}

  @Get()
  findAll() {
    return this.lyricsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.lyricsService.findById(id);
  }

  @Post()
  create(@Body() lyricsData: any) {
    return this.lyricsService.create(lyricsData);
  }
}
