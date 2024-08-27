import { IsNotEmpty, IsMongoId } from 'class-validator';

export class RemoveFromCartDto {
    @IsNotEmpty()
    @IsMongoId()
    productId: string;
}
