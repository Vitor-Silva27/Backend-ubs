import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({nome, telefone}: CreateUserDto) {
    
    if(telefone){

      const exists = await this.findByPhone(telefone);
  
      if(exists) {
        return new Error("já existe um usuário com esse número de telefone");
      }
    }

    return this.prisma.user.create({
      data: {
        nome: nome?.toLowerCase(),
        telefone: telefone || '',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id
      }
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: {
        telefone: phone
      }
    });
  }

  async findByName(name: string) {
    return this.prisma.user.findFirst({
      where: {
        nome: name.toLowerCase()
      }
    });
  }

  async update(id: string, {nome, avaliacao, telefone}: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        avaliacao,
        nome: nome?.toLowerCase(),
        telefone: telefone || undefined
      }
    });
  }

  async rating(telefone: string, rating: number) {
    if(!telefone) {
      return new Error("Número de telefone não fornecido!")
    }

    const exists = await this.findByPhone(telefone);

    if(!rating) {
      return new Error("Avaliação inválida!");
    }

    if(!exists) {
      return new Error("Número de telefone inválido!");
    }

    return this.prisma.user.update({
      where: {
        telefone
      },
      data: {
        avaliacao: rating
      }
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }

  async getUserRatings() {
    const ratings = await this.prisma.user.groupBy({
      by: ['avaliacao'],
      _count: {
        avaliacao: true,
      },
    });

    const totalRatings = ratings.reduce((sum, rating) => sum + rating._count.avaliacao, 0);
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, rating) => sum + (rating.avaliacao ?? 0) * rating._count.avaliacao, 0) /
          totalRatings
        : 0;

    const formattedRatings = ratings.map((rating) => ({
      avaliacao: `Avaliação ${rating.avaliacao}: ${rating._count.avaliacao} usuários`,
    }));

    return {
      ratings: formattedRatings,
      media: `Média: ${averageRating.toFixed(2)}`,
    };
  }

  async getTotalUsers() {
    return this.prisma.user.count();
  }

  async getUserMessageCount(userId: string) {
    const messages = await this.prisma.log.findMany({
      where: {
        userId,
      },
    });

    return {
      userId,
      messageCount: messages.length,
    };
  }

  async getNewUsersPerDay() {
    const newUsers = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true,
      },
    });

    return newUsers.map((user) => ({
      date: user.createdAt.toISOString().split('T')[0],
      count: user._count.createdAt,
    }));
  }
}
