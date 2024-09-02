import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { SCHEMA_OPTIONS } from '~/common/constants';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
<<<<<<< HEAD
    toJSON: { ...SCHEMA_OPTIONS },
    toObject: {
        ...SCHEMA_OPTIONS,
    },
})
export class Cart {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: Number })
    totalCartPrice: number;

    @Prop([
        {
            product: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 0 },
        },
    ])
    items: { product: Types.ObjectId; quantity: number }[];
=======
  toJSON: { ...SCHEMA_OPTIONS },
  toObject: {
    ...SCHEMA_OPTIONS,
  },
})
export class Cart {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 0 },
    },
  ])
  items: { product: Types.ObjectId; quantity: number }[];
>>>>>>> main
}

export const CartSchema = SchemaFactory.createForClass(Cart);
