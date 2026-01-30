import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OffersService } from './offers.service';
import { OffersController, TaskActionsController } from './offers.controller';

@Module({
  imports: [PrismaModule],
  providers: [OffersService],
  controllers: [OffersController, TaskActionsController],
  exports: [OffersService],
})
export class OffersModule {}
