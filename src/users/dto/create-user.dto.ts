import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

//setting up to validate nested object
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {

  @IsNotEmpty({
    message: 'Name khong duoc trong',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'Email khong dung dinh dang',
    },
  )
  @IsNotEmpty({
    message: 'Email khong duoc trong',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password khong duoc trong',
  })
  password: string;

  @IsNotEmpty({
    message: 'age khong duoc trong',
  })
  age: number;

  @IsNotEmpty({
    message: 'Gender khong duoc trong',
  })
  gender: string;

  @IsNotEmpty({
    message: 'address khong duoc trong',
  })
  address: string;

  @IsNotEmpty({
    message: 'address khong duoc trong',
  })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company; //value type is an object at the beginning of this file
  
}

export class RegisterUserDto {

  @IsNotEmpty({
    message: 'Name khong duoc trong',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'Email khong dung dinh dang',
    },
  )
  @IsNotEmpty({
    message: 'Email khong duoc trong',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password khong duoc trong',
  })
  password: string;

  @IsNotEmpty({
    message: 'age khong duoc trong',
  })
  age: number;

  @IsNotEmpty({
    message: 'Gender khong duoc trong',
  })
  gender: string;

  @IsNotEmpty({
    message: 'address khong duoc trong',
  })
  address: string;
  
}
