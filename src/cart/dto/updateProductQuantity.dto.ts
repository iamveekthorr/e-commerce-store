import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemQuantityDTO {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
