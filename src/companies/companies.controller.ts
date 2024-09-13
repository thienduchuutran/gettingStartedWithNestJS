import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post() //customized decorator, helping get all req.user attributes of user thanks to  jwt.strategy decode token then return user
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    //this line also helps validate if user inputs all info
    console.log('check user info: ', user);
    return this.companiesService.create(createCompanyDto, user); //passing info of the user who creates the company in
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Company with paginate')
  findAll(
    @Query('current') currentPage: string, //const currentPage = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, //if we don't pass anything in @Query(), it gets all query strings, all params, everything
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
