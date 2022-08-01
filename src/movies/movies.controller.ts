import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get()
  async getMoviesList() {
    return this.moviesService.getAllItems();
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async getMovie(id) {
    return this.moviesService.readItem(id);
  }
}
