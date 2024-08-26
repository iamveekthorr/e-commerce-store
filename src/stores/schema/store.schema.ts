import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

const SCHEMA_OPTIONS = {
  virtuals: true,
  transform: true,
};
@Schema({
  toJSON: { ...SCHEMA_OPTIONS },
  toObject: {
    ...SCHEMA_OPTIONS,
  },
})
export class Store {
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  /**
   * Owner of the store
   */
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
