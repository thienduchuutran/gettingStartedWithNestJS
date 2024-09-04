import { Controller, Get, Post, Render, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()   //route /
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,       //this is so that we can use .env file in other modules
    private authService: AuthService
  ) {}         //consumer

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req){  //Passport library does everything for us, that's why now req.user returns all user login data
    return this.authService.login(req.user) //token created by login method in auth.service
  }
}
