import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Store } from "../schema/store.schema";
import { Model } from "mongoose";
import { CreateStoreDTO } from "../dto/create-store.dto";
import { UpdateStoreDTO } from "../dto/update-store.dto";
import { AppError } from "~/common/app-error.common";





@Injectable()
export class StoreService {

    constructor(
        @InjectModel(Store.name)
        private readonly storeModel: Model<Store>,
    ) { }

    async createStore(createStoreDTO: CreateStoreDTO) {
        const newStore = new this.storeModel(createStoreDTO);

        await newStore.save();

        return {
            message: "Store created succesfully"
        }

    }

    async updateStore(id: string, updateStoreDTO: UpdateStoreDTO): Promise<Store> {
        const existingStore = await this.storeModel.findByIdAndUpdate(id, updateStoreDTO, { new: true }).exec();

        if (!existingStore) {
            throw new AppError(
                `Store with ID ${id} not found`,
                HttpStatus.NOT_FOUND
            );
        }

        return existingStore;
    }

    async getAllStores() {

    }

    async getMyStore(id: string) {
        const doc = await this.storeModel.findOne({ owner: id })

        const myStore = doc.toObject();

        return {
            name: myStore.name,
            description: myStore.description,
            id: myStore._id.toString(),
            ownner: myStore.owner
        };

    }

}