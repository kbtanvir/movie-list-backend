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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(dto: LoginDto) {
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

  public async register(dto: RegisterDto) {
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
      ...rest,
      id: Date.now().toString().slice(0, 8),
      email,
      password: hashedPassword,
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
  ): Promise<{ access_token?: string; refresh_token?: string; list?: any }> {
    let access_token: string;
    let refresh_token: string;
    // ? GENERATE ACCESS TOKEN
    // -------------------------
    try {
      access_token = await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          type: 'access_token',
        },
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Could not generate access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ? GENERATE REFRESH TOKEN
    // -------------------------

    try {
      refresh_token = await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          type: 'refresh_token',
        },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

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

  public async changePassword(dto: ChangePasswordDto) {
    // ! ARE CONFIRMING PASSWORDS THE SAME
    // -------------------------

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new HttpException(
        'Passwords does not match',
        HttpStatus.BAD_REQUEST,
      );

    // ! DOES USER EXIST
    // -------------------------

    const record = await this.usersService.findByID(dto.uid);

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

  public async refreshJwtToken(dto: RefreshTokenDto) {
    // ! IS REFRESH TOKEN VALID
    // -------------------------

    const isValid = this.jwtService.decode(dto.refreshToken, {
      json: true,
    });

    if (!isValid) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // * RETURN REFRESH TOKEN
    // -------------------------

    // * RETURN LOGIN RESPONSE

    return { isValid };
  }

  private async getHashedPassword(password: string) {
    const salt = await AuthService.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  private static async generateSalt() {
    return await bcrypt.genSalt(10);
  }
}
