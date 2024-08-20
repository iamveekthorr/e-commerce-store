import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from '../schema/store.schema';
import { Model, Types } from 'mongoose';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UpdateStoreDTO } from '../dto/update-store.dto';
import { AppError } from '~/common/app-error.common';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name)
        private readonly storeModel: Model<Store>,
    ) { }


    async createStore(ownerId: string, createStoreDto: CreateStoreDTO) {
        const storeCount = await this.storeModel.countDocuments({ owner: ownerId });

        if (storeCount >= 10) {
            throw new AppError(
                'You cannot own more than 10 stores',
                HttpStatus.BAD_REQUEST
            );
        }

        const newStore = new this.storeModel({
            ...createStoreDto,
            owner: ownerId,
        });

        newStore.save();

        return {
            message: 'Store created successfully',
        };
    }

    /**
     * only for super-admin
     */
    async getAllStores() {
        const stores = await this.storeModel.find();
        return stores
    }

    /**
     * allows a retailer get their store(s) details
     */
    async getMyStores(id: string) {
        const stores = await this.storeModel.find({
            owner: id,
        });

        if (!stores) {
            throw new AppError(
                `No stores found for user with ID ${id}`,
                HttpStatus.NOT_FOUND,
            );
        }

        return stores;
    }

    async updateMyStore(
        ownerId: string,
        storeId: string,
        updateStore: UpdateStoreDTO,
    ) {

        const store = await this.storeModel.findOne({
            _id: storeId,
            owner: ownerId
        });

        if (!store) {
            throw new AppError(
                `Store with ID ${storeId} not found / this store does not belong to you`,
                HttpStatus.NOT_FOUND,
            );
        }

        await this.storeModel.findByIdAndUpdate(
            storeId,
            { $set: updateStore },
            { new: true },
        );

        return {
            message: 'Store updated successfully',
        };
    }

    async deleteMyStore(
        ownerId: string,
        storeId: string,
    ): Promise<{ message: string }> {
        const store = await this.storeModel.findOne({
            _id: storeId,
            owner: ownerId,
        });

        if (!store) {
            throw new AppError(
                `Store with ID ${storeId} not found / this store does not belong to you`,
                HttpStatus.NOT_FOUND,
            );
        }

        await this.storeModel.findByIdAndDelete(storeId);

        return { message: 'Store deleted successfully' };
    }
}
