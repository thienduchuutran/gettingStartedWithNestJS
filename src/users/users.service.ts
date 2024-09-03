import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // we are injecting module User of Mongoose (MongoDB) into var userModal the line below
    private userModal: Model<User>,
  ) {} //Model<User> here is the generic data type of this userModal var

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(hoidanit: CreateUserDto) {
    const hashPassword = this.getHashPassword(hoidanit.password);
    let user = await this.userModal.create({
      email: hoidanit.email,
      password: hashPassword,
      name: hoidanit.name,
    });

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    return this.userModal.findOne({
      _id: id,
    });
  }

  update(updateUserDto: UpdateUserDto) {
    return `This action updates a user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
