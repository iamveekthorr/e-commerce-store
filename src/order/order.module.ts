import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "~/cart/schema/cart.schema";
import { Product, ProductSchema } from "~/products/schema/product.schema";
import { Order, OrderSchema } from "./schema/order.schema";

@Module({
    imports: [
        MongooseModule.forFeature([

        ]),
    ],
})

export class OrderModule { }