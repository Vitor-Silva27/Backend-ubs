import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private adminService: AdminService, private jwtService: JwtService) {}

    async signIn(username: string, password: string) {
        const admin = await this.adminService.findByUsername(username);

        if (!admin) {
            throw new Error('Admin not found');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const payload = {username: admin.username, sub: admin.id};
        const token = await this.jwtService.signAsync(payload);

        return token;
    }
}
