import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth') //so that all endpoints for login starts with '/auth'
export class AuthController {
  constructor(private authService: AuthService) {} //consumer

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
