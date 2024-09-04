import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  //username and password are the 2 params the passport library returns
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password); //pass is whatever coming, user.password is whatever already stored in db
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      username: user.email, 
      sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
