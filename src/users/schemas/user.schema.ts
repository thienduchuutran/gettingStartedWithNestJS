import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) //whenever we add new or update the db automatically updates all timestamp fields
export class User {
  @Prop({ required: true }) //validating
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  //gotta add the 2 below so mongoose would work
  @Prop()
  isDeleted: boolean

  @Prop()
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
