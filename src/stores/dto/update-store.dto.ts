import { IsOptional, IsString } from 'class-validator';

export class UpdateStoreDTO {

    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

}
