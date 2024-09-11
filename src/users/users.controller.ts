import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() //@Body() is actually req.body, these are to receive arguments from service
  @ResponseMessage('Create a new user')
  async create(
    // @Body("email") email: string,       //"email" in @Body() is the according argument, myEmail is a var that is assigned with the value of the argument "email"
    // //const myEmail = req.body.email
    // @Body("password") password: string,
    // @Body("name") name: string
    @Body() hoidanit: CreateUserDto, @User() user: IUser
  ) {
    let newUser = await this.usersService.create(hoidanit, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  // @UseGuards(TestGuard)   //putting TestGuard in to @UseGuard, then in class TestGuard is where we actually perform logic to validate data
  @Get()
  @ResponseMessage('Fetch user with pagination')
  findAll(
    @Query("current") currentPage: string,  //the thing in @Query() is what frontend passes to backend
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id)
    return foundUser;
  }

  @ResponseMessage('Update a user')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = this.usersService.update(updateUserDto, user)
    return updatedUser;
  }

  @ResponseMessage('Delete a user')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {     //the decorator @Param('id') is to get whatever passed in @Delete()
    return await this.usersService.remove(id, user);
  }
}
