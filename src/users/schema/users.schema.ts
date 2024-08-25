import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';

import { Role } from '~/auth/role.enum';
import { SCHEMA_OPTIONS } from '../../common/schema-options.common';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: { ...SCHEMA_OPTIONS },
  toObject: {
    ...SCHEMA_OPTIONS,
  },
})
export class User {
  id: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: Array, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
