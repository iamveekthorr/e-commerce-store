import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
