import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from '../schema/product.schema';
import { CreateProductDTO } from '../dto/create-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';

import { Store } from '~/stores/schema/store.schema';
import { AppError } from '~/common/app-error.common';
import APIFeatures from '~/common/api-features.service';
import { Order } from '~/order/schema/order.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Store.name)
    private readonly storeModel: Model<Store>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createProduct(ownerId: string, createProductDto: CreateProductDTO) {
    const { storeID, ...productDetails } = createProductDto;

    const userStore = await this.storeModel.findOne({
      _id: storeID,
      owner: ownerId,
    });

    if (!userStore) {
      throw new AppError(`store does not exist`, HttpStatus.FORBIDDEN);
    }

    const newProduct = new this.productModel({
      ...productDetails,
      store: storeID,
    });

    newProduct.save();

    return {
      message: 'product created successfully',
    };
  }

  async getAllProducts(queryString: any) {
    const productQuery = this.productModel.find().populate({
      path: 'store',
      select: 'name description',
    });

    const apiFeatures = new APIFeatures(productQuery, queryString);
    apiFeatures.filter().sort().limitFields().paginate();

    const products = await apiFeatures.query;

    const totalCount = await this.productModel.countDocuments(apiFeatures.q);

    return {
      products,
      totalCount,
    };
  }

  async getProductById(productId: string) {
    const product = await this.productModel.findOne({ _id: productId });

    if (!product) {
      throw new AppError(`Product not found`, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getProductsByStoreId(userId: string, storeId: string) {
    const store = await this.storeModel.findOne({
      _id: storeId,
      owner: userId,
    });

    if (!store) {
      throw new AppError(`Store not found`, HttpStatus.NOT_FOUND);
    }
    const products = await this.productModel.find({
      store: storeId,
    });

    return products;
  }

  async updateMyProduct(userId: string, updateProductDto: UpdateProductDTO) {
    const { productId } = updateProductDto;
    const product = await this.productModel
      .findById(productId)
      .populate('store');
    if (!product) {
      throw new AppError(`product not found`, HttpStatus.NOT_FOUND);
    }

    const store = await this.storeModel.findById(product.store);
    if (!store) {
      throw new AppError(`store not found`, HttpStatus.NOT_FOUND);
    }

    if (store.owner.toString() !== userId) {
      throw new AppError(`Forbidden`, HttpStatus.FORBIDDEN);
    }

    await this.productModel.findByIdAndUpdate(productId, updateProductDto, {
      new: true,
    });

    return { message: 'Product updated successfully' };
  }

  async deleteMyProduct(userId: string, productId: string) {
    const product = await this.productModel
      .findById(productId)
      .populate('store');
    if (!product) {
      throw new AppError(`product not found`, HttpStatus.NOT_FOUND);
    }

    const store = await this.storeModel.findById(product.store);
    if (!store) {
      throw new AppError(`store not found`, HttpStatus.NOT_FOUND);
    }

    if (store.owner.toString() !== userId) {
      throw new AppError(`Forbidden`, HttpStatus.FORBIDDEN);
    }

    await this.productModel.findByIdAndDelete(productId);

    return {
      message: 'Product deleted successfully',
    };
  }

  /**
   *
   * only for super-admin
   */
  async deleteProduct(productId: string) {
    const product = await this.productModel.findOne({ _id: productId });

    if (!product) {
      throw new AppError(`Product not found`, HttpStatus.NOT_FOUND);
    }

    await this.productModel.findByIdAndDelete(productId);

    return { message: 'Product deleted successfully' };
  }

  async getRecommendations(userId: string) {
    const products = await this.productModel.find();

    const orders = await this.orderModel
      .find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'productName price',
      })
      .populate('items.quantity');

    // call recommenders to get recommendations

    return { products, orders };
  }
}
