import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './offers.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto, userId: string) {
    return this.prisma.offer.create({
      data: {
        ...createOfferDto,
        userId,
      },
      include: {
        user: { include: { profile: true } },
      },
    });
  }

  async assign(offerId: number, taskId: number) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException('Пропозиція не знайдена');
    }

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Завдання не знайдено');
    }

    // Оновити всі пропозиції до завдання
    await this.prisma.offer.updateMany({
      where: { taskId },
      data: { isAssigned: false },
    });

    // Позначити обрану пропозицію як призначену
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { isAssigned: true },
    });

    // Оновити статус завдання
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'ASSIGNED',
        offer_id: offerId, // fixme
        startTask: new Date(),
      },
    });
  }

  async completeTask(taskId: number, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        offers: true, // ✅ Додати offers для перевірки
      },
    });

    if (!task) {
      throw new NotFoundException('Завдання не знайдено');
    }

    // ✅ ВИПРАВЛЕНО: Перевірити чи користувач є assigned worker
    const assignedOffer = task.offers.find(
      (offer) => offer.isAssigned === true && offer.userId === userId,
    );

    if (!assignedOffer) {
      throw new ForbiddenException(
        'Ви не можете позначити це завдання як виконане',
      );
    }

    // ✅ Перевірити статус
    if (task.status !== 'ASSIGNED') {
      throw new ForbiddenException('Завдання не в статусі ASSIGNED');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'APPLIED',
        endTask: new Date(),
      },
    });
  }

  async payTask(taskId: number, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Завдання не знайдено');
    }

    if (task.authorId !== userId) {
      throw new ForbiddenException('Ви не можете оплатити це завдання');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        isPayed: true,
      },
    });
  }
}
