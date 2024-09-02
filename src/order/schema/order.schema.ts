import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SCHEMA_OPTIONS } from '~/common/constants';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Schema({
    timestamps: true,
    toJSON: { ...SCHEMA_OPTIONS },
    toObject: {
        ...SCHEMA_OPTIONS,
    },
})
export class Order {
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

    @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
