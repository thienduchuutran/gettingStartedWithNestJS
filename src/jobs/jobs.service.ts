import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) //gotta inject the company schema here to interact with company schema in db
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {name, skills, company, salary, quantity, level, location, description, startDate, endDate,
      isActive
    } = createJobDto

    var newJob = await this.jobModel.create({
      name, skills, company, salary, quantity, level, location, description, startDate, endDate,
      isActive,
      createdBy: {
        _id: user._id,
        createdAt: newJob?.createdAt
      }
    })
    return {
      _id: newJob?.id,
      createdAt: newJob?.createdAt,
      result: {
        newJob
      }
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
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
     ;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }

    return await this.jobModel.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    
    let updatedJob = await this.jobModel.updateOne({
      _id: id
    },
    {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    }) 
    return updatedJob;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }

    await this.jobModel.updateOne({
      _id: id,
    },
    {
      isActive: false,
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.jobModel.softDelete({
      _id: id
    });
  }
}
