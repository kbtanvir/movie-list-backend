import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ReqChangePasswordDto } from './dto/req-change-password.dto';

import { JwtAuthGuard } from '../jwt/jwt.guard';
import { ConfirmOPT } from './dto/confirm-opt.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh-token')
  async refreshJwtToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }
  // @UseGuards(JwtAuthGuard)
  @Post('request-change-password')
  async requestChangePassword(@Body() dto: ReqChangePasswordDto) {
    return this.authService.requestChangePassword(dto);
  }
  @Post('confirm-opt')
  async confirmOPT(@Body() dto: ConfirmOPT) {
    return this.authService.confirmOPT(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() uid: string ) {
    return this.authService.logout(uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async test(@Body() dto: { test: string }) {
    return dto;
  }
}
