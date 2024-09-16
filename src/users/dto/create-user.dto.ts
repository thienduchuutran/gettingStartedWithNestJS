import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

//setting up to validate nested object
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'company k de trong'
  })
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
    message: 'role khong duoc trong',
  })
  @IsMongoId({message: "Role has Mongo Id format"})
  role: mongoose.Schema.Types.ObjectId;

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


//this is to get data for dto of login on swagger UI, since for login API in this backend, we passing data 
//through passport lib, so swagger can't get those data to display on swagger UI
export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'duc', description: 'username' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
      example: '123456',
      description: 'password',
  })
  readonly password: string;

}
