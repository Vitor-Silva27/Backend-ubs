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

  // Retorna todos os logs associados a um usuário específico pelo ID do usuário
  async findByUserId(userId: string) {
    return await this.prisma.log.findMany({
      where: { userId },
    });
  }

  // Retorna o número de dias únicos em que um usuário enviou mensagens
  async getDaysEachUserSentMessages() {
  const logs = await this.prisma.log.findMany({
    select: {
      userId: true,
      createdAt: true,
    },
  });

  const userDayMap = new Map<string, Set<string>>();

  for (const log of logs) {
    const date = log.createdAt.toISOString().split('T')[0];
    const userSet = userDayMap.get(log.userId) || new Set<string>();
    userSet.add(date);
    userDayMap.set(log.userId, userSet);
  }

  const result = Array.from(userDayMap.entries()).map(([userId, days]) => ({
    userId,
    uniqueDaysCount: days.size,
  }));

  return result;
}

  // Retorna o número total de usuários únicos que utilizaram(mandaram pelo menos uma mensagem depois de se inscreverem) o chatbot
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
