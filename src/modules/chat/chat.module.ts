import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { SharedService } from '../shared/shared.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [SharedModule],
  controllers: [ChatController, SharedService],
  providers: [ChatService],
})
export class ChatModule {}
