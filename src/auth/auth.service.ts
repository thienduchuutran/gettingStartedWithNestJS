import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService  //need configService to access .env file
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

  async login(user: IUser, response: Response) {
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

    const refresh_token = this.createRefreshToken(payload)

    //update user in db with the new refresh token
    await this.usersService.updateUserToken(refresh_token, _id)

    //set refresh_token as cookies to client
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true, //so that only server can see the refresh token, not client
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))//milliseconds
    })

    return {
      access_token: this.jwtService.sign(payload), //this is where JWT actually is created
      refresh_token,
      user: {
        _id,
        name,
        email,
        role,
      }

    };
  }

  async register(user: RegisterUserDto){
    let newUser = await this.usersService.register(user)  //we pass responsibility to userService since it can interact with db and has hash password

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  //create a refresh token whenever logging in
  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, { //we gonna use 2 different tokens: access token and refresh token
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
    })
    return refresh_token
  }
}
