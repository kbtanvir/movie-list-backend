import { Expose } from 'class-transformer';

export class AuthUserDto {
	@Expose()
	id: string;

	@Expose()
	email: string;
}
