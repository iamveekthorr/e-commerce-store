import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppError } from '~/common/app-error.common';

import { Store } from '../schema/store.schema';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UpdateStoreDTO } from '../dto/update-store.dto';
import APIFeatures from '~/common/api-features.service';

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
        HttpStatus.BAD_REQUEST,
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
  async getAllStores(queryString: any) {
    const storeQuery = this.storeModel.find()
      .populate({
        path: 'owner',
        select: 'email'
      })

    const apiFeatures = new APIFeatures(storeQuery, queryString)
    apiFeatures.filter().sort().limitFields().paginate();

    const stores = await apiFeatures.query;

    const totalCount = await this.storeModel.countDocuments(apiFeatures.q);

    return {
      stores,
      totalCount,
    };
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

  async updateMyStore(ownerId: string, updateStore: UpdateStoreDTO) {
    const { storeId } = updateStore;

    const store = await this.storeModel.findOne({
      _id: storeId,
      owner: ownerId,
    });

    if (!store) {
      throw new AppError(
        `Store with ID ${storeId} not found`,
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

  async deleteMyStore(ownerId: string, storeId: string) {
    const store = await this.storeModel.findOne({
      _id: storeId,
      owner: ownerId,
    });

    if (!store) {
      throw new AppError(
        `Store with ID ${storeId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.storeModel.findByIdAndDelete(storeId);

    return { message: 'Store deleted successfully' };
  }
}
