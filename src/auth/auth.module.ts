import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.registerAsync({   //let nestjs know that we are using JWT passprt library
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy],
    //we need UsersService since it's in another folder, and this auth is another module
    //if we import a whole UsersModule, we can use whatever in UsersModule
    exports: [AuthService]
})
export class AuthModule {}
