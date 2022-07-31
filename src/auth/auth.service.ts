import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity, UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // ! DOES USER EXIST
    // -------------------------
    const record = await this.usersService.findByEmail(dto.email);

    if (!record) {
      throw new HttpException('Email does not exist', HttpStatus.UNAUTHORIZED);
    }

    // ! IS PASSWORD VALID
    // -------------------------

    const isValid = await bcrypt.compare(dto.password, record.password);

    if (!isValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // * RETURN LOGIN RESPONSE
    // -------------------------

    return this.loginResponse(record);
  }

  async register(dto: RegisterDto) {
    const { email, password, ...rest } = dto;

    // ! DOES USER ALREADY EXIST
    // -------------------------

    const record = await this.usersService.findByEmail(email);

    if (record) {
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.getHashedPassword(password);

    // ! WAS NEW USER CREATED IN DB
    // -------------------------

    const newUser = await this.usersService.create({
      id: Date.now().toString().slice(0, 8),
      email,
      password: hashedPassword,
      ...rest,
    });

    if (!newUser)
      throw new HttpException(
        'User could not be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // * RETURN LOGIN RESPONSE
    // -------------------------

    return this.loginResponse(newUser);
  }

  private async loginResponse(
    user: UserEntity,
  ): Promise<{ access_token: string; refresh_token: string; list: any }> {
    // ? GENERATE ACCESS TOKEN ? //
    // -------------------------

    const access_token = await this.jwtService.signAsync(user);

    // ? GENERATE REFRESH TOKEN ? //
    // -------------------------
    const refresh_token = await this.jwtService.signAsync(user);

    // TODO: remove user list response //

    const list = await this.usersService.getAllUsers();

    // * RETURN RESPONSE
    // -------------------------

    return {
      access_token,
      refresh_token,
      list,
    };
  }

  async changePassword(userID: string, dto: ChangePasswordDto) {
    // ! ARE CONFIRMING PASSWORDS THE SAME
    // -------------------------

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new HttpException(
        'Passwords does not match',
        HttpStatus.BAD_REQUEST,
      );

    // ! DOES USER EXIST
    // -------------------------

    const record = await this.usersService.findByID(userID);

    if (!record) throw new NotFoundException('User not found');

    // ! DOES OLD PASSWORD MATCH
    // -------------------------

    if (!bcrypt.compareSync(dto.oldPassword, record.password)) {
      throw new HttpException('Incorrect old password', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.getHashedPassword(dto.newPassword);

    await this.usersService.update(record.id, hashedPassword);

    // * RETURN RESPONSE
    // -------------------------

    return {
      code: HttpStatus.OK,
      message: 'Password changed successfully',
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
