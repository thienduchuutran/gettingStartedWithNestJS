import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: 'email cant be empty' }) //validating
    @IsEmail({ message: 'email must end with @gmail.com'})
    email: string;
  
    @IsNotEmpty({ message: 'name cant be empty' })
    name: string;
  
    @IsNotEmpty({ message: 'skils cant be empty' })
    @IsArray({ message: 'skills must be an array'})
    @IsString({ each: true, message: 'each skill must be string'})
    skills: string[];
}
