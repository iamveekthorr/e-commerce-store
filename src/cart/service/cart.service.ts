import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schema/cart.schema';
import { AppError } from '~/common/app-error.common';
import { Product } from '~/products/schema/product.schema';
import { RemoveFromCartDto } from '../dto/removeFromCart.dto';
import { AddToCartDto } from '../dto/addToCart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private cartModel: Model<Cart>,
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
    ) { }

    async getCart(userId: string) {
        const cart = await this.cartModel.findOne({ user: userId }).populate('items.product').exec();
        return {
            total: cart.items.length,
            cart: cart.items
        }
    }

    async addToCart(userId: string, addToCartDto: AddToCartDto) {
        let cart = await this.cartModel.findOne({ user: userId });

        const { items } = addToCartDto;

        if (!cart) {
            cart = new this.cartModel({ user: userId, items: [] });
        }

        for (const { productId } of items) {
            const productExists = await this.productModel.exists({ _id: productId });
            if (!productExists) {
                throw new AppError(`Product does not exist`, HttpStatus.NOT_FOUND);
            }

        }
        items.forEach(({ productId, quantity }) => {
            const productObjectId = new Types.ObjectId(productId);

            const existingItem = cart.items.find(
                (item) => item.product.toString() === productObjectId.toString(),
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }
        });

        await cart.save();

        return { message: 'Items added to cart successfully' };
    }

    async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto) {
        const { productId } = removeFromCartDto;

        const cart = await this.cartModel.findOne({ user: userId });

        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId,
        );

        cart.save();

        return { message: 'Items removed from cart successfully' };
    }
}
