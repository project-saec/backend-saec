import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = { ...user, ...updateUserDto };
    return await this.prismaService.user.update({
      where: { id },
      data: updatedUser,
    });
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.prismaService.user.delete({
      where: { id },
    });
  }

  async enable2FA(id, secret: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.enable2FA === true) {
      throw new ConflictException('2FA already enabled');
    }
    return await this.prismaService.user.update({
      where: { id },
      data: {
        twoFASecret: secret,
        enable2FA: true,
      },
    });
  }

  async disable2FA(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.enable2FA === false) {
      throw new ConflictException('2FA already disable');
    }
    return await this.prismaService.user.update({
      where: { id },
      data: { enable2FA: false, twoFASecret: null },
    });
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.prismaService.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
