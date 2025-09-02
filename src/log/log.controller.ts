import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.logService.create(createLogDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.logService.findByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get('days')
  getDaysUserSentMessages() {
    return this.logService.getDaysEachUserSentMessages();
  }

  @UseGuards(AuthGuard)
  @Get('chatbot/total-users')
  getTotalUsersUsedChatbot() {
    return this.logService.getTotalUsersUsedChatbot();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logService.update(id, updateLogDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logService.remove(id);
  }
}
