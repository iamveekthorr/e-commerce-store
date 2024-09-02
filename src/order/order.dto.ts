

import { isNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartCheckOutDTO {
    @IsNotEmpty()
    cartId: string;

    @IsString()
    @IsNotEmpty()
    shippingAddress: string;
}
