//strategy is where our library handle the code, encode decode in any logic we want

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      //this is where JWT Guard decoding token
      //this is getting token from req.headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'), //we are getting the access token key
    });
  }

  //and if token is valid here then returning data for user
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;
    //req.user
    return {
      _id,
      name,
      email,
      role,
    };
  }
}
