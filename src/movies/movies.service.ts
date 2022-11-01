import { Injectable } from '@nestjs/common';

import { ReturnModelType } from '@typegoose/typegoose';

import { InjectModel } from 'nestjs-typegoose';
import { MoviesEntity } from './entity/movie-entity';
export type MovieGenre = 'action' | 'comedy' | 'drama' | 'thriller';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(MoviesEntity)
    private readonly model: ReturnModelType<typeof MoviesEntity>,
  ) {}

  async getAllItems(): Promise<MoviesEntity[]> {
    return this.model.find().exec();
  }

  async readItem(id: string): Promise<MoviesEntity> {
    return this.model.findOne({ _id: id }).exec();
  }
  async createItem(dto: MoviesEntity): Promise<MoviesEntity> {
    const createdCat = new this.model(dto);
    return createdCat.save();
  }
  async updateItem(
    id: string,
    dto: Partial<MoviesEntity>,
  ): Promise<MoviesEntity> {
    return this.model.findOneAndUpdate({ _id: id }, dto, { new: true });
  }

  async deleteItem(id: string): Promise<void> {
    this.model.findOneAndDelete({ _id: id }).exec();
  }
}
