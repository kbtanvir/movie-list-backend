import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // @UseGuards(JwtAuthGuard)
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
