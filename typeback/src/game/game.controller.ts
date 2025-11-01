import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  // Save single-player result
  @Post('results')
  async saveResult(@Body() resultData: { userId?: string; lyricsId: string; score: number; durationMs: number }) {
    return this.gameService.saveResult(resultData);
  }

  // Create multiplayer session
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSession(@Request() req, @Body() body: { lyricsId: string }) {
    return this.gameService.createSession(req.user._id, body.lyricsId);
  }

  // Join multiplayer session (alternative to WebSocket)
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinSession(@Request() req, @Param('id') id: string) {
    return this.gameService.joinSession(id, req.user._id, req.user.username, '');
  }

  // Get session details
  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.gameService.getSession(id);
  }
}
