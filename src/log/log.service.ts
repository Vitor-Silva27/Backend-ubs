import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLogDto: CreateLogDto) {
    return await this.prisma.log.create({
      data: createLogDto,
    });
  }

  async findAll() {
    return await this.prisma.log.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.log.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateLogDto: UpdateLogDto) {
    return await this.prisma.log.update({
      where: { id },
      data: updateLogDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.log.delete({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return await this.prisma.log.findMany({
      where: { userId },
    });
  }

  async getDaysUserSentMessages(userId: string) {
    const messages = await this.prisma.log.findMany({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
    });

    const uniqueDays = new Set(
      messages.map((message) => message.createdAt.toISOString().split('T')[0])
    );

    return uniqueDays.size;
  }

  async getTotalUsersUsedChatbot() {
    const users = await this.prisma.log.findMany({
      distinct: ['userId'],
      select: {
        userId: true,
      },
    });

    return users.length;
  }
}
