import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) //gotta inject the company schema here to interact with company schema in db
    private PermissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {name, apiPath, module, method} = createPermissionDto
    const {_id, email} = user 

    //how to check if a permission already existed
    const isExist = await this.PermissionModel.findOne({
      apiPath, method
    })
    if(isExist){
      throw new BadRequestException(`Permission with apiPath=${apiPath}, method=${method} already existed`)
    }

    const newPermission = await this.PermissionModel.create({
      name, apiPath, module, method,
      createdBy: {
        _id: user._id, 
        email: user.email
      }
    })
    return {
      _id: newPermission?._id,
      createdAt:newPermission?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population, projection} = aqp(qs)
    delete filter.current
    delete filter.pageSize
  
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.PermissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.PermissionModel.find(filter)
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
      };;
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException("not found permission")
    }
    
    return await this.PermissionModel.findById(id);
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("not found permission")
    }

    const {module, method, apiPath, name} = updatePermissionDto
    
    return await this.PermissionModel.updateOne({
      _id: _id
    },
    {
      module, method, apiPath, name,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException("not found permission")
    }
    
    await this.PermissionModel.updateOne({
      _id: id
    },
    {
      deletedBy: {
        id: user._id,
        email: user.email
      }
    });
    return await this.PermissionModel.softDelete({
      _id: id
    })
  }
}
