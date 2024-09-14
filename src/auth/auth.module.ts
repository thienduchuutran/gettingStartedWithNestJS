import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
import { AuthController } from './auth.controller';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RolesModule,  //in order to user rolesService in auth.controller, gotta import RolesController in auth.module
    JwtModule.registerAsync({
      //let nestjs know that we are using JWT passprt library
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  //we gotta include JwtStrategy here as provider in auth.module so that the app knows the existence of JwtStrategy
  providers: [AuthService, LocalStrategy, JwtStrategy],
  //we need UsersService since it's in another folder, and this auth is another module
  //if we import a whole UsersModule, we can use whatever in UsersModule
  exports: [AuthService],
  controllers: [AuthController] //here so that our module recognize this new-added AuthController
})
export class AuthModule {}
