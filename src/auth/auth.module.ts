import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthService],  //we need UsersService since it's in another folder, and this auth is another module
  imports: [UsersModule]})  //if we import a whole UsersModule, we can use whatever in UsersModule
export class AuthModule {}
