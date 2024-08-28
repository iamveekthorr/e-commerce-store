import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Cart, CartSchema } from './schema/cart.schema';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
        ]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule { }