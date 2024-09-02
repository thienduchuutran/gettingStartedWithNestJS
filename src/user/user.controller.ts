/* eslint-disable prettier/prettier */
import { Controller, Delete, Get } from '@nestjs/common';

@Controller('user')       //the param passed in here is the router link
export class UserController {
  
  @Get()      //this is a method, and method "Get" always run when we access a website
  findAll(): string {
    return 'This action returns all users with Duc';
  }

  @Delete('/by-id')
  findById(): string {
    return 'This action will delete a user by id';
  }
}
