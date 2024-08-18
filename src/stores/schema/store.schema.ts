import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type StoreDocument = HydratedDocument<Store>;

@Schema()
export class Store {
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
