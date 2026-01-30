import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOfferDto } from './offers.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user.userId);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard)
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.offersService.assign(id, taskId);
  }
}

@Controller('tasks')
export class TaskActionsController {
  constructor(private readonly offersService: OffersService) {}

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  async complete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.offersService.completeTask(id, req.user.userId);
  }

  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard)
  async pay(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.offersService.payTask(id, req.user.userId);
  }
}
