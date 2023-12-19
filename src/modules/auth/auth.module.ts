import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from 'utils/constant/constants';
import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      global: true,
      secret: CONSTANTS.secret,
      signOptions: { expiresIn: '1day' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
