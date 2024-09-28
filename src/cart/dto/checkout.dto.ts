import { IsNotEmpty, IsString } from 'class-validator';

export class CartCheckOutDTO {
  @IsNotEmpty()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}
