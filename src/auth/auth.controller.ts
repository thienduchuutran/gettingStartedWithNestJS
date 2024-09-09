import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth') //so that all endpoints for login starts with '/auth'
export class AuthController {
  constructor(private authService: AuthService) {} //consumer

  //added Public decorator so that it doesn't check JWT before loging in
  @Public()
  @UseGuards(LocalAuthGuard) //now we actually have jwt
  @Post('/login')
  handleLogin(@Request() req) {
    //Passport library does everything for us, that's why now req.user returns all user login data
    return this.authService.login(req.user); //token created by login method in auth.service
  }

  @Public() //this means we don't need to use JWT
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto){
    console.log('check register: ', registerUserDto)
    return this.authService.register(registerUserDto)
  }
}
