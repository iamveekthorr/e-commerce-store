import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SCHEMA_OPTIONS } from '~/common/constants';
import { OrderStatus } from '../enum/status.enum';

export type OrderDocument = HydratedDocument<Order>;


@Schema({
    timestamps: true,
    toJSON: { ...SCHEMA_OPTIONS },
    toObject: {
        ...SCHEMA_OPTIONS,
    },
})
export class Order {

    id :string;
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop([
        {
            product: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ])
    items: { product: Types.ObjectId; quantity: number }[];

    @Prop({ required: true })
    totalCost: number;


    @Prop({ required: true })
    shippingAddress: string;

    @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
