import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)  //gotta inject the company schema here to interact with company schema in db
    private companyModal: SoftDeleteModel<CompanyDocument>
  ){

  }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) { //getting info of the user who creates the company
    return await this.companyModal.create({
      // name: createCompanyDto.name,
      // address: createCompanyDto.address,
      // description: createCompanyDto.description
    ...createCompanyDto,
    createdBy: {
      _id: user._id,
      email: user.email
    }
    });
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
