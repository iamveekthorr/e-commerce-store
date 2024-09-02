import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schema/cart.schema';
import { AppError } from '~/common/app-error.common';
import { AddToCartDto } from '../dto/addToCart.dto';
import { UpdateCartItemQuantityDTO } from '../dto/updateProductQuantity.dto';
import { Order } from '~/order/schema/order.schema';
import { OrderDTO } from '~/order/order.dto';
import { Product } from '~/products/schema/product.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private cartModel: Model<Cart>,
        @InjectModel(Order.name)
        private orderModel: Model<Order>,
        @InjectModel(Product.name)
        private productModel: Model<Product>,
    ) { }


    async getCart(userId: string) {
        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.product');


        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        return {
            total: this.calculateTotalCost(cart),
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

        let cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.product');

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

       
        cart.totalCartPrice = this.calculateTotalCost(cart);

        await cart.save();

        return { message: 'Items added to cart successfully' };
    }

    async removeFromCart(userId: string, productId: string) {
        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.product');

        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId,
        );
        cart.totalCartPrice = this.calculateTotalCost(cart);

        await cart.save();
        return { message: 'Item removed from cart successfully' };
    }

    async updateCartItemQuantity(userId: string, update: UpdateCartItemQuantityDTO) {
        const { productId, quantity } = update;

        if (quantity < 1) {
            throw new AppError(
                'Invalid quantity. Quantity must be greater than or equal to 1.',
                HttpStatus.BAD_REQUEST
            );
        }

        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.product');

        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product._id.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            throw new AppError(
                `Product not found in the cart.`,
                HttpStatus.NOT_FOUND
            );
        }

        cart.totalCartPrice = this.calculateTotalCost(cart);
        await cart.save();

        return { message: 'Item quantity updated successfully', cart: cart };
    }

    async checkoutCart(userId: string, orderDTO: OrderDTO) {

        const { cartId, shippingAddress } = orderDTO;

        const session = await this.cartModel.startSession();
        session.startTransaction();

        try {
            const cart = await this.cartModel
                .findOne({ _id: cartId })
                .populate('items.product');
            if (!cart) {
                throw new AppError(
                    `cart does not exist or you have no cart`,
                    HttpStatus.NOT_FOUND
                );

            }

            /**
             * if paymemt service is available
             */

         //   await this.updateProductQuantities(cart.items);

            const order = await this.orderModel.create({
                user: userId,
                cartItems: cart.items,
                shippingAddress: shippingAddress,
                totalCost: cart.totalCartPrice 
            });

            await order.save();


            await this.cartModel.findByIdAndDelete(cartId);

            return { message: 'Cart checkout successful', orderId: order._id };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private calculateTotalCost(cart): number {
        let totalPrice = 0;
        cart.items.forEach((item) => {
            totalPrice += item.quantity * item.product.price;
        });
        cart.totalCartPrice = totalPrice;
        return totalPrice;
    }

    private async updateProductQuantities(items: { product: Types.ObjectId; quantity: number }[]) {
        for (const item of items) {
            const product = await this.productModel.findById(item.product);

            if (product) {
                if (product.quantity < item.quantity) {
                    throw new AppError(
                        `Insufficient stock for product: ${product.productName}`,
                        HttpStatus.BAD_REQUEST
                    );
                }

                product.quantity -= item.quantity;

                await product.save();
            }
        }
    }

}
