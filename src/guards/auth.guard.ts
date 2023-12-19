import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CONSTANTS } from 'utils/constant/constants';
import { PrismaService } from '../modules/shared/prisma/prisma.service';
import { IS_PUBLIC_KEY } from './../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const { externalid } = request.headers;

    const isValid = Boolean(externalid)
      ? await this.isApiValid(externalid, token)
      : await this.isTokenValid(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      let payload;
      if (Boolean(externalid)) {
        const user = await this.prisma.users.findUnique({
          where: { email: externalid },
          include: {
            Roles: true,
          },
        });
        payload = {
          email: user.email,
          name: user.name,
          uid: user.id,
          role: user.Roles,
        };
      } else {
        payload = await this.jwtService.verifyAsync(token, {
          secret: CONSTANTS.secret,
        });
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async isTokenValid(token: string): Promise<boolean> {
    // Query the database to check if the token exists and is not expired
    const dbToken = await this.prisma.users.findFirst({
      where: {
        tokens: {
          has: token, // Check if the token exists in the tokens array
        },
      },
    });

    return !!dbToken;
  }

  private async isApiValid(ownerId: string, token: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { email: ownerId },
    });
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        ownerId: {
          in: [user.id, user.creatorId],
        },
      },
    });
    const isMatch = await bcrypt.compare(token, apiKey?.key);
    return isMatch;
  }
}
