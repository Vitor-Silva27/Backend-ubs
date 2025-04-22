import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { LogModule } from './log/log.module';

@Module({
  imports: [UsersModule, LogModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
