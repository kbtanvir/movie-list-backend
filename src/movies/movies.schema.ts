import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MoviesDocument = Movies & Document;

@Schema()
export class Movies {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  duration: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  genres: string[];

  @Prop()
  actors: string[];

  @Prop()
  directors: string[];

  @Prop()
  productionCompanies: string[];

  @Prop()
  rating: number;
}

export const MoviesSchema = SchemaFactory.createForClass(Movies);
