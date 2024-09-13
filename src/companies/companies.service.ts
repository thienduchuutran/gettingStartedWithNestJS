import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import { use } from 'passport';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) //gotta inject the company schema here to interact with company schema in db
    private companyModal: SoftDeleteModel<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    //getting info of the user who creates the company
    return await this.companyModal.create({
      // name: createCompanyDto.name,
      // address: createCompanyDto.address,
      // description: createCompanyDto.description
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  //page magination with nestJS
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModal.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModal.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
    .populate(population)
    .exec();

    return {  //this is what we are returning to frontend
      meta: {
      current: currentPage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
     
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }

    return await this.companyModal.findById({
      _id: id
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModal.updateOne(
      {
        _id: id,
      }, //this is finding the right company using company id
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    //since softDelete ain't support deletedBy, we gotta use updateOne here
    await this.companyModal.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.companyModal.softDelete({
      _id: id,
    });
  }
}
