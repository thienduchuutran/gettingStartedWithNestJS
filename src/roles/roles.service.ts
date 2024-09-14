import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) //gotta inject the company schema here to interact with company schema in db
    private RoleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const{name} = createRoleDto
    const isExist = await this.RoleModel.findOne({name})
    if(isExist){
      throw new BadRequestException('This role already existed')
    }
    const {permissions, isActive, description} = createRoleDto
    let newRole = await this.RoleModel.create({
      permissions, isActive, description,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population, projection} = aqp(qs)
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.RoleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.RoleModel.find(filter)
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
      };;;
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException("not found permission")
    }

    return await this.RoleModel.findById(id)  //number 1's mean we wanna select these fields 
    .populate({ path: "permissions", select: {_id: 1, apiPath: 1, name: 1, method: 1, module: 1}});  //this is to fetch all the permissions of the role
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("not found permission")
    }

    const {name, description, isActive, permissions} = updateRoleDto

    // const isExist = await this.RoleModel.findOne({name})
    // if(isExist){
    //   throw new BadRequestException(`Role with name=${name} existed`)
    // }

    const updated = await this.RoleModel.updateOne({
      _id
    },
  {
    name, description, isActive, permissions,
    updatedBy: {
      _id: user._id,
      email: user.email
    }
  })
    
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.RoleModel.updateOne({
      _id: id
    },
    {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return await this.RoleModel.softDelete({
      _id: id
    })
  }
}
