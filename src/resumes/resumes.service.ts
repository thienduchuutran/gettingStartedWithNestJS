import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) //gotta inject the company schema here to interact with company schema in db
    private resumesModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const {url, companyId, jobId} = createUserCvDto
    const {_id, email} = user

    let newCV = await this.resumesModel.create({
      url, companyId, email, jobId,
      userId: _id,
      status: 'PENDING', 
      createdBy: {
        _id, email
      },
      history: [{
        status: 'PENDING',
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    ]
    })
    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population} = aqp(qs)
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumesModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumesModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentPage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      };
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException("not found resume")
    }

    return await this.resumesModel.findById(id) ;
  }

  async findByUsers(user: IUser){
    return await this.resumesModel.find({
      userId: user._id
    })
  }

  async update(_id: string, status: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("not found resume")
    }

    const updated = await this.resumesModel.updateOne({
      _id: _id
    },
    {
      status,
      updatedBy: {
        _id: user._id,
        email: user.email
      },
      $push: {  //a techniques to push new element into an array that has old element(s), not overridding
        history: {
          status: status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    })
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumesModel.updateOne({
      _id: id
    },
    {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.resumesModel.softDelete({
       _id: id
    });
  }
}
