import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { CreateStoreDTO } from '../dto/create-store.dto';


@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Post()
    async createStore(@Body() createStoreDTO: CreateStoreDTO) {
        return this.storeService.createStore(createStoreDTO);
    }

}