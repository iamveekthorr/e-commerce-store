import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../schema/product.schema";
import { Model } from "mongoose";
import { CreateProductDTO } from "../dto/create-product.dto";
import { Store } from "~/stores/schema/store.schema";
import { AppError } from "~/common/app-error.common";
import { User } from "~/users/schema/users.schema";
import { Role } from "~/auth/role.enum";


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


}