import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService, PrismaService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
