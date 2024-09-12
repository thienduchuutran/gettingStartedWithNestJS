
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty } from 'class-validator';

//PartialType() helps inherit all the attributes of the data type inside
export class UpdateJobDto extends PartialType(CreateJobDto) {}