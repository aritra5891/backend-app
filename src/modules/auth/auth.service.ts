import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    // return {
    //   success: true,
    //   access_token: await this.generateAuthToken(user),
    // };
  }

  async generateAuthToken(user: any) {
    const payload = {
      email: user.email,
      name: user.name,
      uid: user.id,
    };
    return await this.jwtService.signAsync(payload);
  }
}
