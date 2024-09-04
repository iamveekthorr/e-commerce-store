import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schema/order.schema";
import { OrderService } from "./service/order.service";
import { OrderController } from "./controller/order.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
})

export class OrderModule { }