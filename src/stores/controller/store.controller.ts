import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UpdateStoreDTO } from '../dto/update-store.dto';
import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { JWTPayload } from '~/auth/jwt-payload.type';
import { Roles } from '~/auth/decorators/roles.decorator';
import { Role } from '~/auth/role.enum';
import { User } from '~/users/schema/users.schema';

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Post()
    async createStore(@Body() createStoreDTO: CreateStoreDTO) {
        return this.storeService.createStore(createStoreDTO);
    }


    @Get('my')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.USER, Role.SUPER_ADMIN)
    async getMyStore(@CurrentUser() user: User) {
        return this.storeService.getMyStore(user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SUPER_ADMIN)
    async getAllStores(
    ) {
        return this.storeService.getAllStores();
    }

    @Put('my/:storeId')
    @UseGuards(JwtAuthGuard)
    async updateMyStore(
        @CurrentUser() user: JWTPayload,
        @Body() updateStore: UpdateStoreDTO,
        @Param('storeId') storeId: string,
    ) {
        return this.storeService.updateMyStore(user.sub, storeId, updateStore);
    }


}
