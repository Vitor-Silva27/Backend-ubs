import { Injectable, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from "bcrypt";
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    @UseGuards(AuthGuard)
    async create(createAdminDto: CreateAdminDto) {
        const { username, password, telefone } = createAdminDto;

        const adminExists = await this.prisma.admin.findUnique({
            where: { username }
        });

        if (adminExists) {
            throw new Error('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await this.prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                telefone
            }
        });

        return admin;
    }

    @UseGuards(AuthGuard)
    async findOne(id: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id }
        });
        return admin;
    }

    @UseGuards(AuthGuard)
    async findByUsername(username: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { username }
        });
        return admin;
    }
}
