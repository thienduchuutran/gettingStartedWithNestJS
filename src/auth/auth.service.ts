import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { use } from 'passport';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,  //need configService to access .env file
    private rolesService: RolesService, //since we already imported rolesModule in auth.module, we can use this rolesService here
  ) {}

  //username and password are the 2 params the passport library returns
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password); //pass is whatever coming, user.password is whatever already stored in db
      if (isValid === true) {
        const userRole = user.role as unknown as {_id: string; name: string}
        const temp = await this.rolesService.findOne(userRole._id)

        const objUser = {
          ...user.toObject(), //user is in model type, so this converting user to JS object
          permissions: temp?.permissions ?? []
        }
        return objUser;
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

  //Verifying if a token after getting from client is valid or not (expired not not)
  processNewToken = async (refreshToken: string, response: Response) => {
    try{
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"), //this secret is for nestJS to decode to see if token is valid
      })
      let user = await this.usersService.findUserByToken(refreshToken)
      
      if(user){
        //update refresh token
        const { _id, name, email, role } = user;  //building user param
        const payload = { //payload is to create new access token
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

    const refresh_token = this.createRefreshToken(payload)

    //update user in db with the new refresh token
    await this.usersService.updateUserToken(refresh_token, _id.toString()) //the db in query process will convert it back to objectID

    //fetch user's role
    const userRole = user.role as unknown as {_id: string; name: string}
    const temp = await this.rolesService.findOne(userRole._id)  //getting permissions data

    //clearing cookie before issuing a new one
    response.clearCookie("refresh_token")
    response.clearCookie("refresh_token1")
    response.clearCookie("key1")

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
        permissions: temp?.permissions?? []
      }

    };
      }else{
        throw new BadRequestException(`Refresh token k hop le, vui long log in`)
      }
    }catch(error) {
      throw new BadRequestException(`Refresh token k hop le, vui long log in`)
    }
  }

  logout = async(response: Response, user: IUser) => {
    await this.usersService.updateUserToken("", user._id)
    response.clearCookie("refresh_token")
    return "ok"
  }

}
