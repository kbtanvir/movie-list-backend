import { Injectable, NotFoundException } from '@nestjs/common';

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
    return await this.model.find().exec();
  }

  async readItem(id: string): Promise<MoviesEntity> {
    return await this.model.findOne({ _id: id }).exec();
  }
  async createItem(dto: MoviesEntity): Promise<MoviesEntity> {
    const createdCat = new this.model(dto);
    return await createdCat.save();
    // testing
  }
  async updateItem(
    id: string,
    dto: Partial<MoviesEntity>,
  ): Promise<MoviesEntity> {
    const res = await this.model.findOneAndUpdate({ _id: id }, dto, {
      new: true,
    });
    if (!res) throw new NotFoundException('Item not found');
    return res;
  }

  async deleteItem(id: string): Promise<any> {
    const res = await this.model.findOneAndDelete({ _id: id });

    if (!res) throw new NotFoundException('Item not found');

    return {
      deleted: true,
      id: res._id,
    };
  }
}
