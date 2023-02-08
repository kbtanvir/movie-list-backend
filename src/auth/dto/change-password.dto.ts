import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  uid: Types.ObjectId;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8)
  // oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8)
  // repeatPassword: string;
}
