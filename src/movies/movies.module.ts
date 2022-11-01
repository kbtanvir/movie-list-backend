import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { MoviesEntity } from './entity/movie-entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    TypegooseModule.forFeature([MoviesEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtStrategy],
  exports: [MoviesService],
})
export class MoviesModule {}
