import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.get('JWT_SECRET'),
        secret: 'secret',
      }),
    }),
    UsersModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtStrategy],
  exports: [MoviesService],
})
export class MoviesModuel {}
