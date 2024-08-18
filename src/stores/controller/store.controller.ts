import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UpdateStoreDTO } from '../dto/update-store.dto';
import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { JWTPayload } from '~/auth/jwt-payload.type';


@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Post()
    async createStore(@Body() createStoreDTO: CreateStoreDTO) {
        return this.storeService.createStore(createStoreDTO);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async updateStore(
        @Body() updateStore: UpdateStoreDTO,
        @Param('id') id: string
    ) {
        return this.storeService.updateStore(id, updateStore);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getMyStore(@CurrentUser() user: JWTPayload) {

        return this.storeService.getMyStore(user.sub);
    }
}