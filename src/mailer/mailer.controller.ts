import {
  Controller,
  // Delete,
  Get,
  HttpCode,
} from '@nestjs/common';

import { MailerService } from './mailer.service';

@Controller('mailer')
// @UseGuards(JwtAuthGuard)
export class MailerController {
  constructor(private mailerService: MailerService) {}

  @HttpCode(200)
  @Get()
  async testEmail() {
    return await this.mailerService.sendTestEmail();
  }

  // @HttpCode(200)
  // @Post()
  // async createItem(@Body() dto: MoviesEntity) {
  //   return await this.moviesService.createItem(dto);
  // }

  // @HttpCode(200)
  // @Patch(':id')
  // async updateItem(
  //   @Param('id') id: string,
  //   @Body() dto: Partial<MoviesEntity>,
  // ) {
  //   return await this.moviesService.updateItem(id, dto);
  // }

  // @HttpCode(200)
  // @Delete(':id')
  // async deleteItem(@Param('id') id: string) {
  //   return await this.moviesService.deleteItem(id);
  // }
}
