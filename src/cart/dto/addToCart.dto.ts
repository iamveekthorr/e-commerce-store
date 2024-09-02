import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
