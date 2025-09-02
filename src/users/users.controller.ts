import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }


  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('ratings')
  async getUserRatings() {
    console.log('Fetching user ratings...');
    return await this.usersService.getUserRatings();
  }

  @UseGuards(AuthGuard)
  @Get('total-users')
  async getTotalUsers() {
    return this.usersService.getTotalUsers();
  }

  @UseGuards(AuthGuard)
  @Get('message-count')
  async getUserMessageCount() {
    return this.usersService.getMessagesPerUser();
  }

  @UseGuards(AuthGuard)
  @Get("avg-message-count")
  async getAverageMessagesPerUser() {
    return this.usersService.getAverageMessagesPerUser();
  }

  @UseGuards(AuthGuard)
  @Get('new-users-per-day')
  async getNewUsersPerDay() {
    return this.usersService.getNewUsersPerDay();
  }

  @UseGuards(AuthGuard)
  @Get('by-phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    const result = await this.usersService.findByPhone(phone);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('by-name/:name')
  async findByName(@Param('name') name: string) {
    const result = await this.usersService.findByName(name);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('rating/:phone')
  async rating(@Param('phone') phone: string, @Body() body: { rating: number }) {
    const result = await this.usersService.rating(phone, body.rating);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
