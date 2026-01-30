import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('categories') categories?: string,
    @Query('sort') sort?: 'date' | 'price' | 'title',
  ) {
    const categoryIds = categories
      ? categories.split(',').map(Number)
      : undefined;
    return this.tasksService.findAll(search, categoryIds, sort);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyTasks(
    @Req() req,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'date' | 'price' | 'title',
  ) {
    return this.tasksService.findMyTasks(req.user.userId, status, search, sort);
  }

  @Get('assigned')
  @UseGuards(JwtAuthGuard)
  async findAssignedTasks(
    @Req() req,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'date' | 'price' | 'title',
  ) {
    return this.tasksService.findAssignedTasks(
      req.user.userId,
      status,
      search,
      sort,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Get(':id/offers')
  @UseGuards(JwtAuthGuard)
  async getTaskOffers(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.getTaskOffers(id, req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.remove(id, req.user.userId);
  }

  @Patch(':id/unassign')
  @UseGuards(JwtAuthGuard)
  async unassign(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.unassign(id, req.user.userId);
  }
}
