import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateRoleDto {

  @IsNotEmpty({
    message: 'name khong duoc trong',
  })
  name: string;
  
  @IsNotEmpty({
    message: 'description khong duoc trong',
  })
  description: string;
  
  @IsNotEmpty({
    message: 'isActive khong duoc trong',
  })
  isActive: boolean;

  @IsNotEmpty({message: 'permissions k duoc trong'})
  @IsMongoId({each: true, message: 'each permissions la mongo object id'})
  @IsArray({message: 'permissions co dinh dang la array'})
  permissions: mongoose.Schema.Types.ObjectId[]
}