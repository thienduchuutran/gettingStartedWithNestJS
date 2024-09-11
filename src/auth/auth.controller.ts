import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth') //so that all endpoints for login starts with '/auth'
export class AuthController {
  constructor(private authService: AuthService) {} //consumer

  //added Public decorator so that it doesn't check JWT before loging in
  @Public()
  @UseGuards(LocalAuthGuard) //now we actually have jwt
  @Post('/login')
  @ResponseMessage('User Login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {//Res to assign cookies to client
    //Passport library does everything for us, that's why now req.user returns all user login data
    return this.authService.login(req.user, response); //token created by login method in auth.service
  }

  @Public() //this means we don't need to use JWT
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto)
  }

  @ResponseMessage('Get user info')
  @Get('/account')
  handleGetAccount(@User() user: IUser){  //req.user since that's what we customize User decorator
    return {user}
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request){  //this is how we server get cookies from client
    const refreshToken = request.cookies["refresh_token"]  //we set the name "refresh_token" for response.cookies in auth.services
    return {refreshToken}
  }
}
