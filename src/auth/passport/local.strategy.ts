import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  //this is local-passport sending username and password to check if they're valid in db, not issuing jwt yet (that's passport-jwt job)
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Username / password k hop le'); //this message is shown on UI
    }
    return user; //this is gonna be returned to handleLogin(@Request() req) in app.controller, then handleLogin() is calling login() in authService
  }
}
