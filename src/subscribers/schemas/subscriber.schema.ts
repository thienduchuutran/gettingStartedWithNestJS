import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({ timestamps: true }) //whenever we add new or update the db automatically updates all timestamp fields
export class Subscriber {
  @Prop({ required: true }) //validating
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  skills: string[];

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

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
