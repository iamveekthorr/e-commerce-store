import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { Store, StoreSchema } from "./schema/store.schema";
import { StoreController } from "./controller/store.controller";
import { StoreService } from "./service/store.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    ],
    controllers: [StoreController],
    providers: [StoreService],
})
export class StoreModule { }