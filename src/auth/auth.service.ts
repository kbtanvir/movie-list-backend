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
import { JwtPayload } from './dto/jwt.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly refresh_tokens = new Map<string, string>();

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

    return this.generateTokens(record);
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

    return this.generateTokens(newUser);
  }

  private async generateTokens(
    user: UserEntity,
  ): Promise<{ access_token?: string; refresh_token?: string; id?: any }> {
    const { id } = user;
    let access_token: string, refresh_token: string;

    // ? CLEAR MAP OF REFRESH TOKEN FOR USER
    // -------------------------

    this.refresh_tokens.delete(id);

    // ? GENERATE ACCESS TOKEN
    // -------------------------
    try {
      access_token = await this.jwtService.signAsync(
        {
          id,
          user: {
            id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          type: 'access_token',
        },
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        },
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ? GENERATE REFRESH TOKEN
    // -------------------------

    try {
      refresh_token = await this.jwtService.signAsync(
        {
          id,
          user: {
            id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          type: 'refresh_token',
        },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ? ADD REFRESH TOKEN TO MAP
    // -------------------------

    this.refresh_tokens.set(user.id, refresh_token);

    // * RETURN RESPONSE
    // -------------------------

    return {
      access_token,
      refresh_token,
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

    const user = await this.usersService.verifiedUser(dto.uid);

    // ! DOES OLD PASSWORD MATCH
    // -------------------------

    if (!bcrypt.compareSync(dto.oldPassword, user.password)) {
      throw new HttpException('Incorrect old password', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.getHashedPassword(dto.newPassword);

    await this.usersService.update(user.id, hashedPassword);

    // * RETURN RESPONSE
    // -------------------------

    return {
      code: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
  public async logout(dto: RefreshTokenDto) {
    // ! DID SENT BY USER
    // -------------------------

    const { id: userID } = this.jwtService.decode(
      dto.refreshToken,
    ) as JwtPayload;

    // ! DOES USER EXIST
    // -------------------------

    const record = await this.usersService.findByID(userID);

    if (!record) throw new NotFoundException('User not found');

    // ! IS REFRESH TOKEN VALID
    // -------------------------

    if (!this.refresh_tokens.has(userID)) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // * REMOVE REFRESH TOKEN FROM MAP
    // -------------------------

    this.refresh_tokens.delete(userID);

    // * RETURN RESPONSE
    // -------------------------

    return {
      code: HttpStatus.OK,
      message: 'Logged out successfully',
    };
  }

  public async refreshTokens(dto: RefreshTokenDto) {
    // * DECODE JWT PAYLOAD
    // -------------------------

    const jwtPayload = this.jwtService.decode(dto.refreshToken) as JwtPayload;

    // ! IS TYPE REFRESH TOKEN
    // -------------------------

    if (jwtPayload.type !== 'refresh_token') {
      throw new HttpException(
        'Refresh token is required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // ! DOEST REFRESH TOKEN EXIST
    // -------------------------

    if (this.refresh_tokens.get(jwtPayload.id) !== dto.refreshToken) {
      throw new HttpException(
        'Refresh token is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // ! IS REFRESH TOKEN EXPIRED

    const isExpired = jwtPayload.exp < Date.now() / 1000;

    if (isExpired) {
      throw new HttpException(
        'Refresh token is expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // ! DOES USER EXIST
    // -------------------------

    const record = await this.usersService.findByID(jwtPayload.id);

    if (!record) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // * RETURN LOGIN RESPONSE

    return this.generateTokens(record);
  }

  private async getHashedPassword(password: string) {
    const salt = await AuthService.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  private static async generateSalt() {
    return await bcrypt.genSalt(10);
  }
}
