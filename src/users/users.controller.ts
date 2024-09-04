import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() //@Body() is actually req.body, these are to receive arguments from service
  create(
    // @Body("email") email: string,       //"email" in @Body() is the according argument, myEmail is a var that is assigned with the value of the argument "email"
    // //const myEmail = req.body.email
    // @Body("password") password: string,
    // @Body("name") name: string
    @Body() hoidanit: CreateUserDto,
  ) {
    // return this.usersService.create(email, password, name);
    console.log('check: ', hoidanit);
    return this.usersService.create(hoidanit);
  }

  @UseGuards(TestGuard)   //putting TestGuard in to @UseGuard, then in class TestGuard is where we actually perform logic to validate data
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':hoidanit')
  findOne(@Param('hoidanit') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {     //the decorator @Param('id') is to get whatever passed in @Delete()
    console.log('check id: ', id)
    return this.usersService.remove(id);
  }
}
