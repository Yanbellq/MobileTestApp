import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, userType, name } = signUpDto;

    // Перевірити, чи користувач вже існує
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    // Хешувати пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Створити користувача та профіль за допомогою транзакції
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            name,
            role: userType,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Генерувати JWT токен
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Порівняти паролі
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Генерувати JWT токен
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Користувача не знайдено');
    }

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(`Невірний токен, ${error}`);
    }
  }

  async updateProfile(
    userId: string,
    updateData: { name?: string; email?: string; avatarUrl?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Користувача не знайдено');
    }

    // Перевірити, чи email вже використовується іншим користувачем
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new BadRequestException('Цей email вже використовується');
      }
    }

    // Оновити email в User якщо він змінений
    if (updateData.email) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: updateData.email },
      });
    }

    // Оновити профіль (name, avatarUrl)
    await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.avatarUrl && { avatarUrl: updateData.avatarUrl }),
      },
    });

    // Повернути оновлені дані
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return {
      id: updatedUser!.id,
      email: updatedUser!.email,
      profile: updatedUser!.profile,
    };
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Користувача не знайдено');
    }

    // Перевірити поточний пароль
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Невірний поточний пароль');
    }

    // Хешувати новий пароль
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Оновити пароль
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Пароль успішно змінено' };
  }
}
