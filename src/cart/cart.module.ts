import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Product, ProductSchema } from '~/products/schema/product.schema';
import { Order, OrderSchema } from '~/order/schema/order.schema';
import { Cart, CartSchema } from './schema/cart.schema';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';

@Module({
<<<<<<< HEAD
    imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: Order.name, schema: OrderSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [CartController],
    providers: [CartService],
=======
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
>>>>>>> main
})
export class CartModule {}
