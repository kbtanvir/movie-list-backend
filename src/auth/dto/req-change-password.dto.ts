import { IsNotEmpty, IsString } from 'class-validator';

export class ReqChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
