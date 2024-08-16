import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';

import { Role } from '~/auth/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: Array, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
