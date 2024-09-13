import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schema/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true }) //whenever we add new or update the db automatically updates all timestamp fields
export class Resume {
  @Prop() //validating
  email: string;

  @Prop()
  url: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})  //to join table
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Job.name})  //to join table
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId})
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: {
         _id: mongoose.Schema.Types.ObjectId, 
         email: string
        }
  }[];  //an array that contains objects    

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  //these 2 below are for soft delete
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
