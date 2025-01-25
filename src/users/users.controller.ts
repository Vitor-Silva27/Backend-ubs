import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto)

    if (result instanceof Error) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('by-phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    const result = await this.usersService.findByPhone(phone);

    if (result instanceof Error) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  @Get('by-name/:name')
  async findByName(@Param('name') name: string) {
    const result = await this.usersService.findByName(name)

    if (result instanceof Error) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  @Patch('rating/:phone')
  async rating(@Param('phone') phone: string, @Body() body: { rating: number }) {
    const result = await this.usersService.rating(phone, body.rating);

    if (result instanceof Error) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto)

    if (result instanceof Error) {
      throw new HttpException(
        result.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
