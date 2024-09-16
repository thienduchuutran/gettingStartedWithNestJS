//auth guard is a middleware checking is we are using jwt strategy or not

import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ //this is the logic handling disabling checking permission of a user
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  } 
  
  //if an endpoint is not public then it runs this block
  handleRequest(err, user, info, context: ExecutionContext) {  //this handleRequest gets result from jwt.strategy of passport lib
    const request: Request = context.switchToHttp().getRequest()
    //the Request is from express 

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [  //this is the logic handling disabling checking permission of a user
      context.getHandler(),
      context.getClass(),
    ]);

    

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Token k hop le hoac k co token o bearer token o header request");
    }

    //check permissions
    const targetMethod = request.method
    const targetEndpoint = request.route?.path as string

    const permissions = user?.permissions ?? []
    let isExist = permissions.find(permission => 
      targetMethod === permission.method
      &&
      targetEndpoint === permission.apiPath
    )
      //doing this so it doesnn't check permission when logging in
      if(targetEndpoint.startsWith("/api/v1/auth")) isExist = true
      if(!isExist && !isSkipPermission){
        throw new ForbiddenException("You don't have permission to access this endpoint")
      }  
    return user;
  }
} //thanks to this, nestjs knows we using jwt
