import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../dto/jwt.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = req.headers.authorization;

    if (!token)
      throw new BadRequestException('Token does not exist in the request');

    const tokenSplit = token.split(' ').pop();

    if (!tokenSplit) throw new BadRequestException('Access token is Required');

    const jwtPayload: JwtPayload = await this.jwtService.verifyAsync(
      tokenSplit,
    );

    if (!jwtPayload) throw new BadRequestException('Invalid Token');

    if (jwtPayload.type !== 'access_token') {
      throw new BadRequestException('Access token is Required');
    }
    const user = await this.userService.findByID(jwtPayload.id);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // IS TOKEN EXIRED
    // -------------------------

    if (jwtPayload.exp < Date.now() / 1000) {
      return false;
    }

    return true;
  }
}
