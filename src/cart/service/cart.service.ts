import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schema/cart.schema';
import { AppError } from '~/common/app-error.common';
import { Order } from '~/order/schema/order.schema';
import { Product } from '~/products/schema/product.schema';
import { CartCheckOutDTO } from '../dto/checkout.dto';
import { AddToCartDto } from '../dto/addToCart.dto';
import { UpdateCartItemQuantityDTO } from '../dto/updateProductQuantity.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private readonly cartModel: Model<Cart>,
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>,
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
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
            totalCost: cart.totalCartPrice,
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


        if (!cart) {
            cart = await this.cartModel.create({
                user: userId,
                items: [{ product: productId, quantity }],
            })

        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }
        }

        await this.calculateTotalCost(cart);
        await cart.save();

        return { message: 'Items added to cart successfully' };
    }

    async removeFromCart(userId: string, productId: string) {
        const cart = await this.cartModel
            .findOne({ user: userId });


        if (!cart) {
            throw new AppError(
                `cart does not exist or you have no cart`,
                HttpStatus.NOT_FOUND
            );
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId,
        );

        await this.calculateTotalCost(cart);
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
            .findOne({ user: userId });

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
        await this.calculateTotalCost(cart);

        await cart.save();

        return { message: 'Item quantity updated successfully' };
    }

    async checkoutCart(userId: string, orderDTO: CartCheckOutDTO) {

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

            await this.updateProductQuantities(cart.items);

            /**
             * if paymemt service is available
             */

            const order = await this.orderModel.create({
                user: userId,
                items: cart.items,
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


    private async calculateTotalCost(cart: Cart) {
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = await this.productModel.findById(item.product);

            if (product) {
                totalPrice += item.quantity * product.price;
            } else {
                throw new AppError(
                    `Product not found `,
                    HttpStatus.NOT_FOUND
                );
            }
        }

        cart.totalCartPrice = totalPrice;

        return totalPrice;

    }
}
