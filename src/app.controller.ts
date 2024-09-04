import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller() //route /
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService, //this is so that we can use .env file in other modules
    private authService: AuthService,
  ) {} //consumer

  //added Public decorator so that it doesn't check JWT before loging in
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    //Passport library does everything for us, that's why now req.user returns all user login data
    return this.authService.login(req.user); //token created by login method in auth.service
  }

  @UseGuards(JwtAuthGuard) //now we actually have jwt
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
