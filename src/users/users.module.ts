import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from './entity/users.entity';
import { UserRepository } from './repo/users.repo';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypegooseModule.forFeature([UserEntity])],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
