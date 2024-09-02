import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppError } from "~/common/app-error.common";
import { HttpStatus, Injectable } from "@nestjs/common";
import { Order } from "../schema/order.schema";
import { OrderStatusDTO } from "../dto/status.dto";


@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>
    ) {
    }

    async getAllOrders() {
        const orders = await this.orderModel
            .find()
            .populate({
                path: 'items.product',
                select: 'productName price'
            })
            .populate('items.quantity');

        return orders;
    }

    async getOrderById(orderId: string) {
        const order = await this.orderModel
            .findOne({ _id: orderId })
            .populate({
                path: 'items.product',
                select: 'productName price'
            })
            .populate('items.quantity');

        if (!order) {
            throw new AppError(`Order not found`, HttpStatus.NOT_FOUND);
        }
        return order;
    }

    async changeOrderStatus(orderId: string, orderStatusDTO: OrderStatusDTO) {

        const { status } = orderStatusDTO;
        const order = await this.orderModel.findOne({ _id: orderId });

        if (!order) {
            throw new AppError(`Order not found`, HttpStatus.NOT_FOUND);
        }
        await this.orderModel.findByIdAndUpdate(
            orderId,
            { status: status.toUpperCase() },
            { new: true }
        );
    }

    async getUserOrders(userId: string) {
        const order = await this.orderModel
            .find({ user: userId })
            .populate({
                path: 'items.product',
                select: 'productName price'
            })
            .populate('items.quantity');
        if (!order) {
            throw new AppError(`No orders found for this user`, HttpStatus.NOT_FOUND);
        }
        return order;
    }

}