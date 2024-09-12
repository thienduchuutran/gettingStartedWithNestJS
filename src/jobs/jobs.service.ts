import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

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

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
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

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
