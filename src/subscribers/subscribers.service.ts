import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { use } from 'passport';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name) //gotta inject the company schema here to interact with company schema in db
    private SubcriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email, name, skills} = createSubscriberDto
    
    const isExist = await this.SubcriberModel.findOne({email})
    if(isExist){
      throw new BadRequestException(`Email ${email} already existed in the system`)
    }

    let newSub = await this.SubcriberModel.create({
      name, email, skills,
      createdBy: {
        id: user._id,
        email: user.email
      }
    });

    return newSub
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population, projection} = aqp(qs)
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.SubcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.SubcriberModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
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
      throw new BadRequestException("not found subscriber")
    }

    return await this.SubcriberModel.findById(id)  
  };

  async update( updateSubscriberDto: UpdateSubscriberDto, user: IUser) {

    let updated = await this.SubcriberModel.updateOne({
      email: user.email
    },
    {
      ...updateSubscriberDto,
      updatedBy:{
        _id: user._id,
        email: user.email
      }
    },
    {
      upsert: true  //if a user hasn't subscribed, meaning the user ain't have id yet, so we add new, otherwise update
    })

    return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException("not found subscriber")
    } 

    await this.SubcriberModel.updateOne({
      _id: id
    },
    {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return await this.SubcriberModel.softDelete({
      _id: id
    })
  }

  async getSkills(user: IUser){
    const {email} = user
    return await this.SubcriberModel.findOne({email}, {skills: 1})
  }
}
