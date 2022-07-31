import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {

  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmNewPassword: string;
}
