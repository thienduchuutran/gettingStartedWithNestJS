import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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

  name: string;
  address: string;
}
