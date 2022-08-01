import { Injectable } from '@nestjs/common';
import { demoMovies } from './constants/demo';

export type MovieGenre = 'action' | 'comedy' | 'drama' | 'thriller';

export type MovieEntity = {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  genres: MovieGenre;
  actors: string[];
  directors: string[];
  writers: string[];
  productionCompanies: string[];
  rating: number;
};

@Injectable()
export class MoviesService {
  private readonly doc: MovieEntity[] = demoMovies;

  async getAllItems(): Promise<MovieEntity[]> {
    return [...this.doc];
  }

  async readItem(id: string): Promise<MovieEntity | undefined> {
    return this.doc.find((item) => item.id === id);
  }
  async createItem(item: MovieEntity): Promise<MovieEntity> {
    this.doc.push(item);
    return item;
  }
  async updateItem(
    id: string,
    payload: Partial<MovieEntity>,
  ): Promise<MovieEntity> {
    const item = await this.readItem(id);
    if (!item) {
      throw new Error('Item not found');
    }
    Object.assign(item, payload);
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.readItem(id);
    if (!item) {
      throw new Error('Item not found');
    }
    this.doc.splice(this.doc.indexOf(item), 1);
  }
}
