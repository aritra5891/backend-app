import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK || 200)
  @Post('login')
  signIn(@Body() loginDto: LoginDto, @Ip() ip) {
    return this.authService.signIn(loginDto);
  }

  @Get('myaccount')
  @HttpCode(HttpStatus.OK || 200)
  myaccount(@Request() req) {
    return req.user;
  }
}
