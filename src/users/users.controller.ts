import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async login(@Param('id') id: Types.ObjectId) {
    return this.userService.getUserDetails(id);
  }
}
