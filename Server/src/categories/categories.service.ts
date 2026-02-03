import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          icon: createCategoryDto.icon,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Категорія з такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Категорія з ID ${id} не знайдена`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          icon: updateCategoryDto.icon,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Категорія з ID ${id} не знайдена`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Категорія з такою назвою вже існує');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Категорія з ID ${id} не знайдена`);
      }
      if (error.code === 'P2014') {
        throw new BadRequestException(
          "Не можна видалити категорію, до якої прив'язані завдання",
        );
      }
      throw error;
    }
  }
}
