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
import { Request, response, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { read } from 'fs';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth') //so that all endpoints for login starts with '/auth'
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService //dependency injection
  ) {} //consumer

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
  async handleGetAccount(@User() user: IUser){  //req.user since that's what we customize User decorator
    const temp = await this.rolesService.findOne(user.role._id) as any  //querying db to get permissions of a user 
    user.permissions = temp.permissions //this is where we actually assigning permissions for a user
    return {user}
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response){  //this is how we server get cookies from client
    const refreshToken = request.cookies["refresh_token"]  //we set the name "refresh_token" for response.cookies in auth.services
    return this.authService.processNewToken(refreshToken, response)
  }

  @ResponseMessage('Logout user')
  @Post('/logout')
  handleLogout(
    @Res({passthrough: true}) response: Response, //need response to get cookie
    @User() user: IUser //get the info of the user who's logging out
  ){  
      return this.authService.logout(response, user)
  }
}
