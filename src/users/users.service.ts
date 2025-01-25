import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({nome, telefone}: CreateUserDto) {
    if(!nome){
      return new Error("Nome não fornecido!")
    }
    if(!telefone) {
      return new Error("Número de telefone não fornecido!")
    }

    const exists = await this.findByPhone(telefone);

    if(exists) {
      return new Error("já existe um usuário com esse número de telefone");
    }

    return this.prisma.user.create({
      data: {
        nome,
        telefone
      }
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
        nome: name
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
        nome,
        telefone
      }
    });
  }

  async rating(telefone: string, rating: number) {
    const exists = await this.findByPhone(telefone);

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
}
