import { Injectable } from '@nestjs/common';
import { MovieEntity } from './entity/movie-entity';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movies, MoviesDocument } from './movies.schema';
export type MovieGenre = 'action' | 'comedy' | 'drama' | 'thriller';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movies.name) private model: Model<MoviesDocument>) {}

  async getAllItems(): Promise<MovieEntity[]> {
    return this.model.find().exec();
  }

  async readItem(id: string): Promise<MovieEntity> {
    return this.model.findOne({ _id: id }).exec();
  }
  async createItem(dto: MovieEntity): Promise<MovieEntity> {
    const createdCat = new this.model(dto);
    return createdCat.save();
  }
  async updateItem(
    id: string,
    dto: Partial<MovieEntity>,
  ): Promise<MovieEntity> {
    return this.model.findOneAndUpdate({ _id: id }, dto, { new: true });
  }

  async deleteItem(id: string): Promise<void> {
    this.model.findOneAndDelete({ _id: id }).exec();
  }
}
