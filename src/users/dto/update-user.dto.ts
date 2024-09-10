import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

//PartialType() helps inherit all the attributes of the data type inside

//OmitType helps ignor an attribute
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty({message: '_id k duoc de trong'})
  _id: string; //initializing id field, so user has to input id in to update info
}
