import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { ObjectID } from './ObjectID.decorator';

export class DocumentCT {
  @ObjectID()
  @Expose({ name: 'id' })
  _id?: Types.ObjectId;
}

export class DocumentCTWithTimeStamps extends DocumentCT {
  @Prop({ required: false, type: Date })
  @Expose()
  public createdAt?: Date;

  @Prop({ required: false, type: Date })
  @Expose()
  public updatedAt?: Date;
}
