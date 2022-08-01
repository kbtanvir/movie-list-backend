import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { demoMovies } from './constants/demo';

export type MovieGenre = 'action' | 'comedy' | 'drama' | 'thriller';

export type MovieEntity = {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  genres: string[];
  actors: string[];
  directors: string[];
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
    // ! DOES MOVEI EXIST IN THE ARRAY
    // -----------------------

    const item = this.doc.find((item) => item.id === id);

    if (!item) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    return item;
  }
  async createItem(item: MovieEntity): Promise<MovieEntity> {
    if (this.doc.length > 20) {
      throw new HttpException(
        'You watched too many movies',
        HttpStatus.BAD_REQUEST,
      );
    }

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
    if (!id) {
      throw new Error('ID is required');
    }

    const item = await this.readItem(id);
    if (!item) {
      throw new Error('Item not found');
    }
    this.doc.splice(this.doc.indexOf(item), 1);
  }
}
