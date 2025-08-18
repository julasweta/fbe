import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [HttpModule], // 👈 правильне підключення
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService], // 👈 щоб інші модулі могли юзати
})
export class TelegramModule {}
