import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true }) //whenever we add new or update the db automatically updates all timestamp fields
export class Role {
  @Prop() //validating
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
  permissions: Permission[];  //an array that contains id objects    

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

export const RoleSchema = SchemaFactory.createForClass(Role);
