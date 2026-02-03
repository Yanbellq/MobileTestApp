import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    search?: string,
    categoryIds?: number[],
    sortOption: 'date' | 'price' | 'title' = 'date',
  ) {
    const where: Prisma.TaskWhereInput = {
      status: TaskStatus.OPEN,
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (categoryIds && categoryIds.length > 0) {
      where.categoryId = {
        in: categoryIds,
      };
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = {};
    switch (sortOption) {
      case 'price':
        orderBy = { budget: 'desc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'date':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    return this.prisma.task.findMany({
      where,
      orderBy,
      include: {
        author: { include: { profile: true } },
      },
    });
  }

  async findMyTasks(
    userId: string,
    statusFilter?: string,
    search?: string,
    sortOption: 'date' | 'price' | 'title' = 'date',
  ) {
    const where: Prisma.TaskWhereInput = {
      authorId: userId,
    };

    // ✅ ВИПРАВ: Конвертуємо statusFilter в TaskStatus enum
    if (statusFilter && statusFilter !== 'All') {
      const status = this.stringToTaskStatus(statusFilter);
      if (status) {
        where.status = status;
      }
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = {};
    switch (sortOption) {
      case 'price':
        orderBy = { budget: 'desc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'date':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    return this.prisma.task.findMany({
      where,
      orderBy,
    });
  }

  async findAssignedTasks(
    userId: string,
    statusFilter?: string,
    search?: string,
    sortOption?: string,
  ) {
    const where: Prisma.TaskWhereInput = {
      offers: {
        some: {
          userId: userId,
        },
      },
    };

    if (statusFilter && statusFilter !== 'All') {
      const status = this.stringToTaskStatus(statusFilter);
      if (status) {
        where.status = status;
      }
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = {};
    switch (sortOption) {
      case 'price':
        orderBy = { budget: 'desc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'date':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    return this.prisma.task.findMany({
      where,
      orderBy,
      include: {
        author: { include: { profile: true } },
        offers: { include: { user: { include: { profile: true } } } },
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        offers: {
          include: {
            user: { include: { profile: true } },
          },
        },
        author: { include: { profile: true } },
      },
    });

    if (!task) {
      throw new NotFoundException('Завдання не знайдено');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile || user.profile.role !== 'EMPLOYER') {
      throw new ForbiddenException(
        'Тільки роботодавці можуть створювати завдання',
      );
    }

    const taskData: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      budget: new Prisma.Decimal(String(createTaskDto.budget)),
      location: createTaskDto.location,
      address: createTaskDto.address || undefined,
      category: {
        connect: { id: createTaskDto.category },
      },
      startTask: createTaskDto.startTask || undefined,
      endTask: createTaskDto.endTask || undefined,
      status: TaskStatus.OPEN,
      author: {
        connect: { id: userId },
      },
    };

    return this.prisma.task.create({
      data: taskData,
    });
  }

  async getTaskOffers(taskId: number, userId: string) {
    const task = await this.findOne(taskId);

    if (task.authorId !== userId) {
      throw new ForbiddenException(
        'Ви не можете переглядати пропозиції до цього завдання',
      );
    }

    return task.offers || [];
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id);

    if (task.authorId !== userId) {
      throw new ForbiddenException('Ви не можете редагувати це завдання');
    }

    const updateData: Prisma.TaskUpdateInput = {};

    if (updateTaskDto.title !== undefined)
      updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      updateData.description = updateTaskDto.description;
    if (updateTaskDto.budget !== undefined)
      updateData.budget = new Prisma.Decimal(String(updateTaskDto.budget));
    if (updateTaskDto.location !== undefined)
      updateData.location = updateTaskDto.location;
    if (updateTaskDto.address !== undefined)
      updateData.address = updateTaskDto.address;
    if (updateTaskDto.category !== undefined)
      updateData.category = {
        connect: { id: updateTaskDto.category },
      };
    if (updateTaskDto.startTask !== undefined)
      updateData.startTask = updateTaskDto.startTask;
    if (updateTaskDto.endTask !== undefined)
      updateData.endTask = updateTaskDto.endTask;

    if (updateTaskDto.status !== undefined) {
      const status = this.stringToTaskStatus(updateTaskDto.status);
      if (status) {
        updateData.status = status;
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, userId: string): Promise<void> {
    const task = await this.findOne(id);

    if (task.authorId !== userId) {
      throw new ForbiddenException('Ви не можете видалити це завдання');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async unassign(id: number, userId: string) {
    const task = await this.findOne(id);

    if (task.authorId !== userId) {
      throw new ForbiddenException('Ви не можете скасувати призначення');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.OPEN,
        assignedOfferId: null,
      },
    });
  }

  private stringToTaskStatus(status: string): TaskStatus | null {
    if (status.toUpperCase() === 'ALL') return null;

    const statusMap: Record<string, TaskStatus> = {
      Open: TaskStatus.OPEN,
      Assigned: TaskStatus.ASSIGNED,
      Completed: TaskStatus.COMPLETED,
      Applied: TaskStatus.APPLIED,
      Canceled: TaskStatus.CANCELED,
      OPEN: TaskStatus.OPEN,
      ASSIGNED: TaskStatus.ASSIGNED,
      COMPLETED: TaskStatus.COMPLETED,
      APPLIED: TaskStatus.APPLIED,
      CANCELED: TaskStatus.CANCELED,
    };
    return statusMap[status] || null;
  }
}
