import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Movies } from './movies.schema';
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

   @HttpCode(200)
   @Get(':id')
   async readItem(@Param('id') id: string) {
     return this.moviesService.readItem(id);
   }

   @HttpCode(200)
   @Post()
   async createItem(@Body() dto: Movies) {
     return this.moviesService.createItem(dto);
   }

   @HttpCode(200)
   @Patch(':id')
   async updateItem(@Param('id') id: string, @Body() dto: Partial<Movies>) {
     return this.moviesService.updateItem(id, dto);
   }

   @HttpCode(200)
   @Delete(':id')
   async deleteItem(@Param('id') id: string) {
     return this.moviesService.deleteItem(id);
   }
 }
