//auth guard is a middleware checking is we are using jwt strategy or not

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}   //thanks to this, nestjs knows we using jwt
