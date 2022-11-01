import { Prop } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { Model } from 'lib/utils/mongodb/modelOptions';
import { DocumentCTWithTimeStamps } from 'lib/utils/serializer';

@Model('users', true)
export class UserEntity extends DocumentCTWithTimeStamps {
  @Expose()
  @Prop({ required: true, trim: true })
  firstName: string;

  @Expose()
  @Prop({ required: true, trim: true })
  lastName: string;

  @Expose()
  @Prop({ required: true, trim: true })
  email: string;

  @Exclude()
  @Prop({ required: true, type: String })
  password: string; // must be hashed

  @Expose()
  @Prop({ required: false, default: null })
  avatarURL?: string;

  @Expose()
  @Prop({ required: false, type: Date })
  lastLogin?: Date;

  @Expose()
  @Prop({ required: false, type: Boolean, default: false })
  isEmailVerified?: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: true })
  twoStepAuthVerified?: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: true })
  isActive?: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted?: boolean;
}
