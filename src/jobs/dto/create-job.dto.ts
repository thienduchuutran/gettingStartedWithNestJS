import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

//setting up to validate nested object
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'company k de trong'
  })
  name: string;
}
export class CreateJobDto {

  @IsNotEmpty({
    message: 'Name khong duoc trong',
  })
  name: string;

  
  @IsNotEmpty({
    message: 'Skills khong duoc trong',
  })
  @IsArray({
    message: 'Skills co dinh dang la array'
  })
  @IsString({
    each: true,
    message: 'skill dinh dang la string'
  })
  @ArrayMinSize(1, {
    message: 'Phai co it nhat 1 skill'
  })
  skills: string[];

  @IsNotEmpty({
    message: 'Location khong duoc trong',
  })
  location: string;

  @IsNotEmpty({
    message: 'salary khong duoc trong',
  })
  salary: number;

  @IsNotEmpty({
    message: 'quantity khong duoc trong',
  })
  quantity: number;

  @IsNotEmpty({
    message: 'level khong duoc trong',
  })
  level: string;

  @IsNotEmpty({
    message: 'description khong duoc trong',
  })
  description: string;

  @IsNotEmpty({
    message: 'start date khong duoc trong',
  })
  @Transform(({value}) => new Date(value)) //so that it's transformed from string type to date type
  @IsDate({message: 'start date co dinh dang la date'})
  startDate: Date;

  @IsNotEmpty({
    message: 'end date khong duoc trong',
  })
  @Transform(({value}) => new Date(value))
  @IsDate({message: 'end date co dinh dang la date'})
  endDate: Date;

  @IsNotEmpty({
    message: 'is active khong duoc trong',
  })
  @IsBoolean({message: 'is active co dinh dang la boolean'})
  isActive: boolean;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company; //value type is an object at the beginning of this file
  
}
