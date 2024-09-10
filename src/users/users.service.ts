import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync} from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // we are injecting module User of Mongoose (MongoDB) into var userModel the line below
    private userModel: SoftDeleteModel<UserDocument>, //initialize like this so we can use softDelete()
  ) {} //Model<User> here is the generic data type of this userModel var

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(hoidanit: CreateUserDto, @User() user: IUser) {
    const {email, password, name, address, gender, age, role, company} = hoidanit 

        //check email
        const isExist = await this.userModel.findOne({
          email
        })
        if(isExist){
          throw new BadRequestException(`The email ${email} da ton tai dung mail khac`)
        }

    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name, address, gender, age, role, company,
      createdBy: {
        _id: user._id,  //the one who is creating this new user
        email: user.email
      }
    });

    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    return this.userModel.findOne({
      _id: id,
    });
  }

  findOneByUsername(username: string) {

    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string){
    return compareSync(password, hash)
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },   //this is the condition that user has to input id, then comparision be made in db to get the correct record
      { ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
       },   //this is copying the remaining fields/attributes
    );
    return updated
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    return this.userModel.softDelete({
      _id: id,
    });
  }

  async register(user: RegisterUserDto){
    const {name, email, password, age, gender, address} = user
    const hashPassword = this.getHashPassword(password)

    //check email
    const isExist = await this.userModel.findOne({
      email
    })
    if(isExist){
      throw new BadRequestException(`The email ${email} da ton tai dung mail khac`)
    }

    let newRegister = await this.userModel.create({
      name, email, 
      password: hashPassword,
      age, gender, address, role: 'USER'
    })
    return newRegister
  }
}
