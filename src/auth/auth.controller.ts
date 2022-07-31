import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

  // @Post('/refresh-token')
  // async refreshJwtToken(@Body() dto: RefreshTokenDto) {
  //   return this.authService.refreshJwtToken(dto);
  // }

  @Post('/change-password')
  async changePassword(userID: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userID, dto);
  }
}
