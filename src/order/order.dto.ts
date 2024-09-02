

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDTO {
    @IsNotEmpty()
    cartId: string;

    @IsString()
    @IsNumber()
    shippingAddress: string;
}
