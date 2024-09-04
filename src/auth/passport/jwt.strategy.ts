//strategy is where our library handle the code, encode decode in any logic we want

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({ //this is where JWT Guard decoding token
      //this is getting token from req.headers 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN'), //we are getting the access token key
    });
  }

  //and if token is valid here then returning data for user
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
