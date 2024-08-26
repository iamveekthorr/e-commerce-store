import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Category } from '../category.enum';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsEnum(Category)
  category: Category;

  @IsMongoId()
  @IsNotEmpty()
  storeID: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
