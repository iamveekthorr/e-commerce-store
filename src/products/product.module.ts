import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ProductService } from './service/product.service';
import { Store, StoreSchema } from '~/stores/schema/store.schema';
import { Order, OrderSchema } from '~/order/schema/order.schema';

import { ProductController } from './controller/product.controller';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
