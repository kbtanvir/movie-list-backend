import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity, UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.usersService.findByEmail(email);

    // if (!user) {
    //   throw new HttpException('Email doesn not exist', HttpStatus.UNAUTHORIZED);
    // }

    return {
      message: 'working',
      email,
    };
    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return this.loginResponse(user);
  }

  async register(dto: RegisterDto) {
    const { email, password, ...rest } = dto;

    const isExistingUser = await this.usersService.findByEmail(email);
    if (isExistingUser)
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.getHashedPassword(password);

    const user = await this.usersService.create({
      ...rest,
      email,
      password: hashedPassword,
      id: Math.random().toString(36).substring(2),
    });

    if (!user)
      throw new HttpException(
        'User could not be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return this.loginResponse(user);
  }

  async loginResponse(
    user: UserEntity,
  ): Promise<{ access_token: string; refresh_token: string; list: any }> {
    const access_token = await this.jwtService.signAsync(user);
    const refresh_token = await this.jwtService.signAsync(user);
    const list = await this.usersService.getAllUsers();

    return {
      access_token,
      refresh_token,
      list,
    };
  }

  private async getHashedPassword(password: string) {
    const salt = await AuthService.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  private static async generateSalt() {
    return await bcrypt.genSalt(10);
  }
}
