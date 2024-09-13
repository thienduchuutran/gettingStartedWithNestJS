import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Post('by-user')
  @ResponseMessage('Get resume by user')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUsers( user);
  }

  @ResponseMessage('Fetch all resumes')
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('delete a user')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
