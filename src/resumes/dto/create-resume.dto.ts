import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateResumeDto {

  @IsNotEmpty({
    message: 'email khong duoc trong',
  })
  email: string;

  @IsNotEmpty({
    message: 'userId khong duoc trong',
  })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'status khong duoc trong',
  })
  status: string;

  @IsNotEmpty({
    message: 'companyId khong duoc trong',
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'jobId khong duoc trong',
  })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto{
    @IsNotEmpty({
        message: 'url khong duoc de trong'
    })
    url: string

    @IsNotEmpty({
        message: 'companyId k duoc de trong'
    })
    @IsMongoId({
        message: 'companyId is a mongoId'
    })
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({
        message: 'companyId k duoc de trong'
    })
    @IsMongoId({
        message: 'jobId is a mongoId'
    })
    jobId: mongoose.Schema.Types.ObjectId
}