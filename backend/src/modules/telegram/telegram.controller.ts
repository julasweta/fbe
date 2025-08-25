import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('message')
  messagesFromCustomer(@Body() data: any) {
    return this.telegramService.messagesFromCustomer(data);
  }
}
