import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { SCHEMA_OPTIONS } from '~/common/constants';
import { Category } from '../category.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  toJSON: { ...SCHEMA_OPTIONS },
  toObject: {
    ...SCHEMA_OPTIONS,
  },
})
export class Product {
  @Prop({ required: true, type: String })
  productName: string;

  //Refactor to have it's own entity
  @Prop({ required: true, enum: Category })
  category: Category;

  /**
   * The store the product belongs to
   */
  @Prop({ required: true, type: Types.ObjectId, ref: 'Store' })
  store: Types.ObjectId;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: false, type: Number, default: 0 })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
