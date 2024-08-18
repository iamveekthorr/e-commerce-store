import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateStoreDTO {

    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsMongoId()
    owner?: string;

}
