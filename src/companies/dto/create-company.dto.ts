import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {

  @IsNotEmpty({
    message: 'Name khong duoc trong',
  })
  name: string;

  @IsNotEmpty({
    message: 'Address khong duoc trong',
  })
  address: string;

  @IsNotEmpty({
    message: 'Description khong duoc trong',
  })
  description: string;

  @IsNotEmpty({
    message: 'Logo khong duoc trong',
  })
  logo: string;
}
