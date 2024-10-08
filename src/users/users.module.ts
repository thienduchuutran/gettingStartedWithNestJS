import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ], //this is injecting mongdodb into users module (but this is just initializing step, gotta actually inject in the service)
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] //gotta export so AuthModule and AuthServices can use
})
export class UsersModule {}
