import { IsNotEmpty } from 'class-validator';

class CartItemDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    quantity: number;
}

export class AddToCartDto {
    items: CartItemDto[];
}
