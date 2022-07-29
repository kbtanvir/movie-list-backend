import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local.guard';

@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
