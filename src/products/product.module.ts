import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./controller/product.controller";
import { Product, ProductSchema } from "./schema/product.schema";
import { Module } from "@nestjs/common";
import { ProductService } from "./service/product.service";
import { Store, StoreSchema } from "~/stores/schema/store.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Store.name, schema: StoreSchema },
        ]),
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule { }