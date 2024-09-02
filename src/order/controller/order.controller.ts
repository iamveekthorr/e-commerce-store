import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { Roles } from "~/auth/decorators/roles.decorator";
import { Role } from "~/auth/role.enum";
import { JwtAuthGuard } from "~/auth/guards/auth.guard";
import { RolesGuard } from "~/auth/guards/role.guard";
import { OrderService } from "../service/order.service";
import { OrderStatusDTO } from "../dto/status.dto";


@Roles(Role.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {
    }

    @Get()
    async getAllOrders(@Query() queryString: any) {
        return this.orderService.getAllOrders(queryString);
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string) {
        return this.orderService.getOrderById(orderId);
    }

    @Patch(':orderId/status')
    async changeOrderStatus(
        @Param('orderId') orderId: string,
        @Body() orderStatusDTO: OrderStatusDTO) {
        await this.orderService.changeOrderStatus(orderId, orderStatusDTO);
    }

    @Get('users/:userId')
    async getUserOrders(@Param('userId') userId: string) {
        return this.orderService.getUserOrders(userId);
    }

}