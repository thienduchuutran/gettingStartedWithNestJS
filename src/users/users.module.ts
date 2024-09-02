import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({   
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],    //this is injecting mongdodb into users module
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
