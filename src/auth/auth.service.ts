import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: IUser) {
    //IUser so that we can get id, name, email and role of a user
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload), //this is where JWT actually is created
      _id,
      name,
      email,
      role,
    };
  }
}
