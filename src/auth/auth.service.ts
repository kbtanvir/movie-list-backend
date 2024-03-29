import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { UserEntity } from 'src/users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmOPT } from './dto/confirm-opt.dto';
import { JwtPayload } from './dto/jwt.dto';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ReqChangePasswordDto } from './dto/req-change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private readonly refresh_tokens = new Map<string, string>();
  private readonly optCode = new Map<string, string>();

  public async login(dto: LoginDto) {
    // ! DOES USER EXIST
    // -------------------------
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }

    // ! IS PASSWORD VALID
    // -------------------------

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // * RETURN LOGIN RESPONSE
    // -------------------------

    return this.generateTokens(user);
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
  ): Promise<{ accessToken?: string; refreshToken?: string; id?: any }> {
    let accessToken: string, refreshToken: string;

    // ? CLEAR MAP OF REFRESH TOKEN FOR USER
    // -------------------------

    // this.refresh_tokens.delete(id);

    // ? GENERATE ACCESS TOKEN
    // -------------------------
    try {
      accessToken = await this.jwtService.signAsync(
        { id: user._id, type: 'access_token' },
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
      refreshToken = await this.jwtService.signAsync(
        { id: user._id, type: 'refresh_token' },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ? ADD REFRESH TOKEN TO MAP
    // -------------------------

    // this.refresh_tokens.set(user.id, refreshToken);

    // * RETURN RESPONSE
    // -------------------------

    return {
      accessToken,
      refreshToken,
    };
  }
  public async requestChangePassword(dto: ReqChangePasswordDto) {
    const user = await this.usersService.verifyEmail(dto.email);

    const optCode = Math.floor(1000 + Math.random() * 9000).toString();

    this.optCode.set(user.email, optCode);

    await this.mailerService.sendMail({
      to: 'tanvirkhaan003@gmail.com',
      subject: 'Password change request',
      template: 'change-password',
      context: {
        code: optCode,
      },
    });

    // delete the code after 1 minutes

    setTimeout(() => {
      this.optCode.delete(dto.email);
    }, 60000);

    return {
      code: HttpStatus.OK,
      message: `OPT sent to ${dto.email}`,
    };
  }
  public async confirmOPT(dto: ConfirmOPT) {
    const user = await this.usersService.verifyEmail(dto.email);

    // check if the code is valid

    if (this.optCode.get(user.email) !== dto.code) {
      throw new HttpException('Invalid code', HttpStatus.UNAUTHORIZED);
    }

    // check if the code is expired

    if (!this.optCode.has(user.email)) {
      throw new HttpException('Code expired', HttpStatus.UNAUTHORIZED);
    }

    // delete the code from the map

    this.optCode.delete(user.email);

    // generate new tokens

    const tokens = await this.generateTokens(user);

    return {
      code: HttpStatus.OK,
      message: 'Opt verified',
      tokens,
    };
  }
  public async changePassword(dto: ChangePasswordDto) {
    // const isTokenVerified = await this.jwtService.verify(dto.accessToken);

    // if (!isTokenVerified) {
    //   throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    // }

    // ? VERIFY USER EXISTS
    // -------------------------

    const user = await this.usersService.findByID(dto.uid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ? VERIFY VERIFICATION CODE
    // -------------------------
    // const token = this.verification_tokens.get(user.id);

    // if (!token || token !== dto.token) {
    //   this.verification_tokens.delete(user.id);
    //   throw new UnauthorizedException('Invalid token');
    // }

    // ? ARE CONFIRMING PASSWORDS THE SAME
    // ?-------------------------

    // if (dto.newPassword !== dto.repeatPassword) {
    //   throw new HttpException(
    //     'Passwords does not match',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // // ! DOES USER EXIST
    // // -------------------------

    // const user = await this.usersService.verifyEmail(dto.email);

    // ? DOES OLD PASSWORD MATCH
    // ? -------------------------

    // if (!bcrypt.compareSync(dto.oldPassword, user.password)) {
    //   throw new HttpException('Incorrect old password', HttpStatus.BAD_REQUEST);
    // }

    const hashedPassword = await this.getHashedPassword(dto.newPassword);

    await this.usersService.updatePassword(user._id, hashedPassword);

    // * RETURN RESPONSE
    // -------------------------

    return {
      code: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
  public async logout(uid: string) {
    // * REMOVE REFRESH TOKEN FROM MAP
    // -------------------------

    this.refresh_tokens.delete(uid);

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

    // if (this.refresh_tokens.get(jwtPayload.id) !== dto.refreshToken) {
    //   throw new HttpException(
    //     'Refresh token is invalid',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

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
