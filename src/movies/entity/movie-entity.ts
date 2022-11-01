import { Prop } from '@typegoose/typegoose';
import { IsArray } from 'class-validator';
import { Model } from 'lib/utils/mongodb/modelOptions';
import { DocumentCTWithTimeStamps } from 'lib/utils/serializer';

@Model('movies', true)
export class MoviesEntity extends DocumentCTWithTimeStamps {
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

  @IsArray()
  @Prop({ type: () => [String] })
  genres: string[];

  @IsArray()
  @Prop({ type: () => [String] })
  actors: string[];

  @IsArray()
  @Prop({ type: () => [String] })
  directors: string[];

  @IsArray()
  @Prop({ type: () => [String] })
  productionCompanies: string[];

  @Prop({ type: () => [Number] })
  rating: number;
}
