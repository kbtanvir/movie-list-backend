import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MoviesService } from './movies.service';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @HttpCode(200)
  @Get()
  async getMoviesList() {
    return this.moviesService.getAllItems();
  }
  // @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async readItem(@Param('id') id: string) {
    return this.moviesService.readItem(id);
  }
}
