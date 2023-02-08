import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmOPT {
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
