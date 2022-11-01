import { Prop } from '@typegoose/typegoose';
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
