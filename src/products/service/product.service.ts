import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../schema/product.schema";
import { Model, Types } from "mongoose";
import { CreateProductDTO } from "../dto/create-product.dto";
import { Store, StoreDocument } from "~/stores/schema/store.schema";
import { AppError } from "~/common/app-error.common";
import { User } from "~/users/schema/users.schema";
import { Role } from "~/auth/role.enum";
import { UpdateProductDTO } from "../dto/update-product.dto";


@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
        @InjectModel(Store.name)
        private readonly storeModel: Model<Store>
    ) { }

    async createProduct(ownerId: string, createProductDto: CreateProductDTO) {

        const { storeID, ...productDetails } = createProductDto;

        const userStore = await this.storeModel.findOne({ _id: storeID, owner: ownerId });

        if (!userStore) {
            throw new AppError(
                `store does not exist`,
                HttpStatus.FORBIDDEN
            );
        }

        const newProduct = new this.productModel({
            ...productDetails,
            store: storeID,
        });

        newProduct.save();

        return {
            message: "product created succesfully"
        }
    }

    async getAllProducts() {
        const products = await this.productModel.find();
        return products
    }


    async findProductsByStoreIDForRetailer(userId: string, storeId: string) {
        const store = await this.storeModel.findOne({
            _id: storeId,
            owner: userId,
        });

        if (!store) {
            throw new AppError(
                `Store not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        const products = await this.productModel.find({
            store: storeId,
        });

        return products;
    }

    async updateMyProduct(
        userId: string,
        updateProductDto: UpdateProductDTO
    ) {

        const { productId } = updateProductDto;

        const product = await this.productModel.findOne({
            _id: productId,
        })
            .populate({
                path: 'store',
                select: 'owner',
            })
            .lean();

        if (!product) {
            throw new AppError(
                `Product not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        const store = product.store as unknown as { owner: Types.ObjectId };

        if (store.owner.toString() !== userId) {
            throw new AppError(
                `Forbidden`,
                HttpStatus.FORBIDDEN,
            );
        }

        await this.productModel.findByIdAndUpdate(
            productId,
            updateProductDto,
            { new: true }
        );

        return { message: 'Product updated succesfully' };
    }

}