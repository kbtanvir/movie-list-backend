import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [UsersModule],
  providers: [MoviesService],
  exports: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModuel {}
