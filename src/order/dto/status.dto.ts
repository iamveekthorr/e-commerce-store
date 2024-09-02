import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "../enum/status.enum";


export class OrderStatusDTO {

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}