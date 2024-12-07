import {
  NestMiddleware,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      req.originalUrl.includes('register') ||
      req.originalUrl.includes('login')
    ) {
      next();
      return;
    }
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded = jwt.verify(token, 'SECRET') as {
        id: number;
        email: string;
      };
      const user = await this.userService.findOne(decoded.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      req['user'] = user;
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
