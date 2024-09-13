import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreatePermissionDto {

  @IsNotEmpty({
    message: 'name khong duoc trong',
  })
  name: string;

  @IsNotEmpty({
    message: 'apiPath khong duoc trong',
  })
  apiPath: string;
  
  @IsNotEmpty({
    message: 'method khong duoc trong',
  })
  method: string;
  
  @IsNotEmpty({
    message: 'module khong duoc trong',
  })
  module: string;
  
}
