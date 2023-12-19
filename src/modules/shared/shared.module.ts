import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';
@Module({
  controllers: [SharedController],
  providers: [
    SharedService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class SharedModule {}
