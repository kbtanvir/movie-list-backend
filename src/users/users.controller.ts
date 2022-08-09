import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async login(@Param('id') id: string) {
    return this.userService.getUserDetails(id);
  }
}
