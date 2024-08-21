import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStoreDTO {

    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    storeId: string;

}
