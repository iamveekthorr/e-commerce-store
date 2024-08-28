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
        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.product')
            .exec();

        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        return {
            user: cart.user,
            cartid: cart._id,
            items: cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
            })),
        };
    }

    async addToCart(userId: string, addToCartDto: AddToCartDto) {
        const { productId, quantity = 1 } = addToCartDto;

        const productObjectId = new Types.ObjectId(productId);

        let cart = await this.cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await this.cartModel.create({
                user: userId,
                items: [{ product: productId, quantity }],
            })
            await cart.save();

        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }
        }

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
