import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { MoviesController } from './movies.controller';
import { Movies, MoviesSchema } from './movies.schema';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movies.name, schema: MoviesSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtStrategy],
  exports: [MoviesService],
})
export class MoviesModule {}
